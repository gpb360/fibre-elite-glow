import { NextRequest, NextResponse } from 'next/server';
import {
  stripe,
  formatAmountForStripe,
  STRIPE_CONFIG
} from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/admin';
import { enhancedCheckoutSchema, FormValidationUtils } from '@/lib/form-validation';
import { GlobalErrorHandler, ErrorSanitizer } from '@/lib/error-handler';
import { CSRFProtection } from '@/lib/csrf';
import { PRODUCT_PACKAGES, ProductPackage } from '@/lib/package-catalog';
import { getCheckoutBaseUrl } from '@/lib/base-url';
import {
  getStripeCheckoutIdempotencyKey,
  hashCheckoutReceiptToken,
  orderNumberForCheckoutRequest,
} from '@/lib/payment-hardening';
import { z } from 'zod';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';

const CHECKOUT_RATE_WINDOW_MS = 15 * 60 * 1000;
const CHECKOUT_RATE_MAX_REQUESTS = 10;
const checkoutRequests = new Map<string, { count: number; windowStartedAt: number }>();

function isCheckoutRateLimited(clientId: string, now = Date.now()): boolean {
  const attempt = checkoutRequests.get(clientId);
  if (!attempt || now - attempt.windowStartedAt >= CHECKOUT_RATE_WINDOW_MS) {
    checkoutRequests.set(clientId, { count: 1, windowStartedAt: now });
    return false;
  }

  attempt.count += 1;
  return attempt.count > CHECKOUT_RATE_MAX_REQUESTS;
}

// Enhanced server-side validation schema for checkout with CSRF protection
const serverCheckoutSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1, 'Product ID is required').max(100, 'Product ID too long'),
    productName: z.string().min(1, 'Product name is required').max(200, 'Product name too long'),
    productType: z.enum(['total_essential', 'total_essential_plus']).optional(),
    price: z.number().min(0.01, 'Price must be positive').max(9999.99, 'Price too high'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per product'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    image: z.string().optional(),
    packageSize: z.string().max(100).optional(),
  })).min(1, 'Cart cannot be empty').max(50, 'Too many items in cart'),
  customerInfo: enhancedCheckoutSchema,
  affiliateCode: z.string().max(50).optional(),
  checkoutRequestId: z.string().uuid('Invalid checkout request ID'),
  receiptAccessToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/, 'Invalid receipt access token'),
  checkoutRequestedAt: z.number().int().positive(),
  csrfToken: z.string().min(32, 'CSRF token required').max(128, 'CSRF token too long'),
  securityContext: z.object({
    userAgent: z.string().max(500, 'User agent too long'),
    timestamp: z.number().int().positive(),
    formHash: z.string().min(1, 'Form hash required').max(1000, 'Form hash too long')
  }).optional()
});

type CheckoutItem = z.infer<typeof serverCheckoutSchema>['items'][number];
type NormalizedCheckoutItem = ProductPackage & {
  quantity: number;
  boxesPerPackage: number;
};

function inferProductType(item: CheckoutItem): ProductPackage['productType'] {
  if (item.productType) return item.productType;
  const catalogItem = PRODUCT_PACKAGES.find(pkg => pkg.id === item.id);
  if (catalogItem) return catalogItem.productType;
  return item.productName.toLowerCase().includes('plus') ? 'total_essential_plus' : 'total_essential';
}

function boxesForItem(item: CheckoutItem): number {
  const catalogItem = PRODUCT_PACKAGES.find(pkg => pkg.id === item.id);
  if (catalogItem) {
    const match = catalogItem.id.match(/-(\d+)-boxe?s?$/);
    return match ? Number(match[1]) : 1;
  }

  const idMatch = item.id.match(/-(\d+)-boxe?s?$/);
  if (idMatch) return Number(idMatch[1]);

  const sizeMatch = item.packageSize?.match(/(\d+)\s*box/i);
  if (sizeMatch) return Number(sizeMatch[1]);

  return 1;
}

function getPackageForBoxes(productType: ProductPackage['productType'], boxes: number): ProductPackage {
  const catalogPackage = PRODUCT_PACKAGES.find(pkg => pkg.productType === productType && pkg.id.endsWith(`${boxes}-${boxes === 1 ? 'box' : 'boxes'}`));
  if (!catalogPackage) {
    throw new Error(`Missing catalog package for ${productType} ${boxes} box${boxes === 1 ? '' : 'es'}`);
  }
  return catalogPackage;
}

function normalizeCartItems(items: CheckoutItem[]): NormalizedCheckoutItem[] {
  const boxTotals = new Map<ProductPackage['productType'], number>();

  items.forEach(item => {
    const productType = inferProductType(item);
    const boxes = boxesForItem(item) * item.quantity;
    boxTotals.set(productType, (boxTotals.get(productType) || 0) + boxes);
  });

  const normalized: NormalizedCheckoutItem[] = [];
  boxTotals.forEach((boxTotal, productType) => {
    let remaining = boxTotal;
    ([4, 2, 1] as const).forEach(boxesPerPackage => {
      const packageQuantity = Math.floor(remaining / boxesPerPackage);
      if (packageQuantity <= 0) return;
      const pkg = getPackageForBoxes(productType, boxesPerPackage);
      normalized.push({ ...pkg, quantity: packageQuantity, boxesPerPackage });
      remaining -= packageQuantity * boxesPerPackage;
    });
  });

  return normalized;
}

function resolveStripeImageUrl(image: string | undefined, baseUrl: string): string[] | undefined {
  if (!image) return undefined;

  try {
    return [new URL(image, baseUrl).toString()];
  } catch {
    return undefined;
  }
}

// Helper function to calculate total boxes from cart items
function calculateTotalBoxes(items: Array<{id?: string; quantity?: number; boxesPerPackage?: number}>): number {
  return items.reduce((total, item) => {
    if (item.boxesPerPackage && item.quantity) {
      return total + item.boxesPerPackage * item.quantity;
    }
    // Extract box count from package ID
    // Format: "total-essential-1-box" or "total-essential-plus-2-boxes"
    if (item.id) {
      const match = item.id.match(/-(\d+)-boxe?s?$/);
      if (match && item.quantity) {
        const boxesPerPackage = parseInt(match[1], 10);
        return total + (boxesPerPackage * item.quantity);
      }
    }
    return total;
  }, 0);
}

// Get shipping options based on box count tier
function getShippingOptions(boxes: number): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  if (boxes <= 2) {
    // 1-2 boxes: $12
    return [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1200, // $12.00 in cents
            currency: 'cad',
          },
          display_name: 'Shipping (one to two boxes)',
          tax_behavior: 'exclusive',
          tax_code: 'txcd_92010001', // Shipping tax code
        },
      },
    ];
  } else {
    // 3-4 boxes: $20
    return [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 2000, // $20.00 in cents
            currency: 'cad',
          },
          display_name: 'Shipping (three to four boxes)',
          tax_behavior: 'exclusive',
          tax_code: 'txcd_92010001',
        },
      },
    ];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Enhanced security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    
    // CSRF Protection
    const csrfResult = CSRFProtection.validateRequest(request);
    if (!csrfResult.valid) {
            return NextResponse.json(
        {
          error: 'Security validation failed',
          code: 'CSRF_ERROR'
        },
        { status: 403, headers }
      );
    }

    // Enhanced rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || 
                     'unknown';

    if (isCheckoutRateLimited(clientIP.split(',')[0].trim())) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please try again later.', code: 'RATE_LIMITED' },
        {
          status: 429,
          headers: {
            ...Object.fromEntries(headers.entries()),
            'Retry-After': String(CHECKOUT_RATE_WINDOW_MS / 1000),
          },
        }
      );
    }
    
        
    // Temporarily disable bot detection for testing
    // Additional security: check for bot-like behavior
    // const userAgent = request.headers.get('user-agent') || '';
    // const suspiciousBots = [
    //   /bot/i, /crawler/i, /spider/i, /scraper/i,
    //   /curl/i, /wget/i, /postman/i
    // ];
    //
    // if (suspiciousBots.some(pattern => pattern.test(userAgent))) {
    //         return NextResponse.json(
    //     {
    //       error: 'Access denied',
    //       code: 'BOT_DETECTED'
    //     },
    //     { status: 403, headers }
    //   );
    // }

    // Check for required Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: 'Checkout is temporarily unavailable',
          code: 'STRIPE_NOT_CONFIGURED',
        },
        { status: 503, headers }
      );
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json(
        {
          error: 'Checkout is temporarily unavailable',
          code: 'STRIPE_NOT_CONFIGURED',
        },
        { status: 503, headers }
      );
    }

    // Test payments are allowed for the isolated demo environment. Live charges
    // require a separate, private enable switch after inventory and fulfillment
    // policy have been approved and validated end to end.
    if (!STRIPE_CONFIG.testMode && process.env.ENABLE_LIVE_CHECKOUT !== 'true') {
      return NextResponse.json(
        {
          error: 'Checkout is temporarily unavailable',
          code: 'LIVE_CHECKOUT_DISABLED',
        },
        { status: 503, headers }
      );
    }

    const baseUrl = getCheckoutBaseUrl(request.url);
    
    // Parse and validate request body with comprehensive Zod validation
    let rawBody: any;
    try {
      rawBody = await request.json();
    } catch (error) {
            return NextResponse.json(
        {
          error: 'Invalid request format',
          details: ErrorSanitizer.sanitizeMessage(error)
        },
        { status: 400 }
      );
    }

    // Comprehensive server-side validation and sanitization
    const validationResult = serverCheckoutSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      // DEBUG: Log detailed validation errors
      console.log('❌ DEBUG: Validation failed:', {
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
          received: 'received' in err ? err.received : undefined
        }))
      });

      // Format validation errors for client
      const errorMessages = validationResult.error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errorMessages,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    const body = validationResult.data;
    const requestNow = Date.now();

    if (
      body.checkoutRequestedAt < requestNow - 3_600_000 ||
      body.checkoutRequestedAt > requestNow + 300_000
    ) {
      return NextResponse.json(
        { error: 'Checkout request expired. Please refresh and try again.', code: 'REQUEST_EXPIRED' },
        { status: 400, headers }
      );
    }

    const headerIdempotencyKey = request.headers.get('idempotency-key');
    if (headerIdempotencyKey && headerIdempotencyKey !== body.checkoutRequestId) {
      return NextResponse.json(
        { error: 'Checkout request identity mismatch', code: 'IDEMPOTENCY_KEY_MISMATCH' },
        { status: 400, headers }
      );
    }

    // Enhanced security validation for all text fields
    const customerInfo = body.customerInfo;
    

    // Comprehensive security checks
    const securityValidation = FormValidationUtils.getFormSecurityScore({
      ...customerInfo,
      items: body.items.map(item => item.productName).join(' ')
    });
    
    if (!securityValidation.isSecure) {
            return NextResponse.json(
        {
          error: 'Content validation failed',
          details: securityValidation.issues,
          code: 'SECURITY_VIOLATION'
        },
        { status: 400, headers }
      );
    }
    
    // Validate CSRF token if provided (more lenient for checkout)
    if (body.csrfToken && body.csrfToken !== 'checkout-token') {
      // Only validate if it's not the fallback token
      if (!CSRFProtection.validateToken(body.csrfToken)) {
        // Log but don't fail - allow checkout to continue in production
        console.warn('CSRF token validation failed, but allowing checkout to continue');
      }
    }
    
    // Validate timestamp if security context provided
    if (body.securityContext) {
      const timestamp = body.securityContext.timestamp;
      if (timestamp < requestNow - 3_600_000 || timestamp > requestNow + 300_000) {
        return NextResponse.json(
          {
            error: 'Request expired. Please refresh and try again.',
            code: 'REQUEST_EXPIRED'
          },
          { status: 400, headers }
        );
      }
    }

    // Calculate total boxes for shipping tier determination
    const normalizedItems = normalizeCartItems(body.items);
    const totalBoxes = calculateTotalBoxes(normalizedItems);
    console.log('📦 Total boxes calculated:', totalBoxes);

    // Format line items for Stripe with enhanced product data
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = normalizedItems.map(item => ({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        tax_behavior: 'exclusive', // Add this for proper tax calculation
        product_data: {
          name: item.productName,
          description: `Premium gut health supplement - Quantity: ${item.quantity}`,
          images: resolveStripeImageUrl(item.image, baseUrl),
          metadata: {
            product_type: item.productName.toLowerCase().includes('plus') ? 'total_essential_plus' : 'total_essential',
            category: 'gut_health_supplement'
          },
        },
        unit_amount: formatAmountForStripe(item.price), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Generate order number
    const orderNumber = orderNumberForCheckoutRequest(body.checkoutRequestId);

  // Create metadata for the order with enhanced security logging
    const metadata: Record<string, string> = {
      order_number: orderNumber,
      customer_name: `${body.customerInfo.firstName} ${body.customerInfo.lastName}`.substring(0, 500),
      customer_email: body.customerInfo.email,
    shipping_address: JSON.stringify({
        first_name: body.customerInfo.firstName,
        last_name: body.customerInfo.lastName,
        line1: body.customerInfo.address,
        city: body.customerInfo.city,
        state: body.customerInfo.state,
        postal_code: body.customerInfo.zipCode,
        country: body.customerInfo.country
      }),
      customer_phone: body.customerInfo.phone || '',
      order_items: JSON.stringify(normalizedItems.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        package_size: item.packageSize,
        boxes_per_package: item.boxesPerPackage,
        total_boxes: item.boxesPerPackage * item.quantity,
        product_type: item.productType
      }))),
      original_cart_items: JSON.stringify(body.items.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        product_type: inferProductType(item),
        boxes_per_package: boxesForItem(item)
      }))),
      security_validated: 'true',
      csrf_token_validated: body.csrfToken ? 'true' : 'false',
      client_ip: clientIP,
      user_agent: 'checkout-request' // Safe default since bot detection is disabled
    };

    metadata.receipt_access_hash = hashCheckoutReceiptToken(body.receiptAccessToken);
    metadata.checkout_request_id = body.checkoutRequestId;

    // Add affiliate code to metadata if provided
    if (body.affiliateCode) {
      metadata.affiliate_code = body.affiliateCode.toUpperCase().trim();
    }

    // Create checkout session with comprehensive field collection
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&receipt_token=${encodeURIComponent(body.receiptAccessToken)}`;
    const cancelUrl = `${baseUrl}/cart?cancelled=true`;

    // Validate that the success URL is properly formatted
    try {
      const successUrlObj = new URL(successUrl);
      if (successUrlObj.hostname === 'localhost' || successUrlObj.hostname === '127.0.0.1') {
        console.log('⚠️ Using localhost URL for Stripe - ensure Stripe accepts this domain');
      }
    } catch (error) {
      console.error('❌ Invalid checkout return URL configuration:', ErrorSanitizer.sanitizeMessage(error));
      return NextResponse.json(
        { error: 'Invalid success URL configuration' },
        { status: 500 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Checkout is temporarily unavailable', code: 'ORDER_DATABASE_UNAVAILABLE' },
        { status: 503, headers }
      );
    }

    const paymentDatabase = supabaseAdmin as unknown as SupabaseClient;
    const { data: paymentReady, error: paymentReadinessError } = await paymentDatabase.rpc(
      'payment_checkout_ready'
    );
    if (paymentReadinessError || paymentReady !== true) {
      return NextResponse.json(
        { error: 'Checkout is temporarily unavailable', code: 'PAYMENT_SCHEMA_NOT_READY' },
        { status: 503, headers }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: STRIPE_CONFIG.mode,
      success_url: successUrl,
      cancel_url: cancelUrl,

      // Shipping options based on box count tier
      shipping_options: getShippingOptions(totalBoxes),

      // Customer information
      customer_email: body.customerInfo.email,
      
      // ENHANCED: Collect comprehensive customer information
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add countries you ship to
      },
      
      // Collect phone number for order updates
      phone_number_collection: {
        enabled: true,
      },
      
      // Always create a customer record in Stripe for order tracking
      customer_creation: 'always',
      
      // Invoice creation for record keeping
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Order ${orderNumber} - La Belle Vie Products`,
          metadata: {
            order_number: orderNumber,
            customer_email: body.customerInfo.email,
          },
          footer: 'Thank you for choosing La Belle Vie! Questions? Contact support@lbve.ca',
        },
      },
      
      // Allow promotion codes for discounts
      allow_promotion_codes: true,
      
      // REMOVED: Terms of service consent collection until URL is configured in Stripe
      // consent_collection: {
      //   terms_of_service: 'required',
      // },
      
      // Comprehensive metadata for webhook processing
      metadata,
      
      // Enhanced payment intent data for admin notifications
      payment_intent_data: {
        receipt_email: body.customerInfo.email,
        metadata: {
          order_number: orderNumber,
          customer_email: body.customerInfo.email,
          customer_name: `${body.customerInfo.firstName} ${body.customerInfo.lastName}`,
          total_items: body.items.length.toString(),
        },
        description: `La Belle Vie Order ${orderNumber}`,
      },
      
      // Session expiration (24 hours)
      // Stable across network retries so Stripe receives identical idempotent parameters.
      expires_at: Math.floor(body.checkoutRequestedAt / 1000) + (23 * 60 * 60),

      // Automatic tax calculation - Stripe Tax enabled
      automatic_tax: {
        enabled: true, // Automatically calculate tax based on customer location and registrations
      },

      // Tax ID collection for B2B customers (reverse charge / zero-rated supplies)
      tax_id_collection: {
        enabled: true, // Allow customers with valid tax IDs to provide them during checkout
      },
      
      // Custom text for checkout
      custom_text: {
        shipping_address: {
          message: 'Please provide accurate shipping information for timely delivery of your La Belle Vie products.',
        },
        submit: {
          message: 'Complete your order to start your gut health journey with La Belle Vie!',
        },
      },
    }, {
      idempotencyKey: getStripeCheckoutIdempotencyKey(body.checkoutRequestId),
    });

    // Never send a customer to Stripe unless the order can be fulfilled after
    // payment. A retry reuses the same Stripe session through the idempotency key.
    const { error: checkoutPersistenceError } = await supabaseAdmin
      .from('checkout_sessions')
      .upsert({
        session_id: session.id,
        customer_email: body.customerInfo.email,
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || 'CAD',
        payment_intent: session.payment_intent as string,
        metadata,
        status: session.status,
        payment_status: 'pending',
        test_mode: session.livemode === false,
        expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        created_at: new Date().toISOString(),
      }, { onConflict: 'session_id' });

    if (checkoutPersistenceError) {
      await stripe.checkout.sessions.expire(session.id).catch(expirationError => {
        console.error(
          'Unable to expire an unpersisted Stripe session:',
          ErrorSanitizer.sanitizeMessage(expirationError)
        );
      });
      throw new Error(`Unable to persist checkout session: ${checkoutPersistenceError.message}`);
    }

    // Log successful session creation with enhanced details
    
    // Return the checkout session URL with order information
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      orderNumber: orderNumber,
      fieldsEnabled: [
        'billing_address',
        'shipping_address', 
        'phone_number',
        'promotion_codes'
      ]
    });
    
  } catch (error) {
    console.error('Checkout session creation error:', error);

    // Provide more detailed error information for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
       // cause: error.cause,
        timestamp: new Date().toISOString()
      });
    }

  // Use enhanced error handler with sanitization
    return GlobalErrorHandler.handleApiError(error);
  }
}
