import { NextRequest, NextResponse } from 'next/server';
import {
  stripe,
  formatAmountForStripe,
  STRIPE_CONFIG
} from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/client';
import { checkoutFormSchema, cartItemSchema } from '@/lib/validation';
import { enhancedCheckoutSchema, SecurityValidation, FormValidationUtils } from '@/lib/form-validation';
import { GlobalErrorHandler, ErrorSanitizer } from '@/lib/error-handler';
import { CSRFProtection } from '@/lib/csrf';
import { z } from 'zod';

// Enhanced server-side validation schema for checkout with CSRF protection
const serverCheckoutSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1, 'Product ID is required').max(100, 'Product ID too long'),
    productName: z.string().min(1, 'Product name is required').max(200, 'Product name too long'),
    price: z.number().min(0.01, 'Price must be positive').max(9999.99, 'Price too high'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per product'),
    imageUrl: z.string().url('Invalid image URL').optional(),
  })).min(1, 'Cart cannot be empty').max(50, 'Too many items in cart'),
  customerInfo: enhancedCheckoutSchema,
  csrfToken: z.string().min(32, 'CSRF token required').max(128, 'CSRF token too long'),
  securityContext: z.object({
    userAgent: z.string().max(500, 'User agent too long'),
    timestamp: z.number().min(Date.now() - 300000, 'Request too old').max(Date.now() + 60000, 'Request from future'),
    formHash: z.string().min(1, 'Form hash required').max(1000, 'Form hash too long')
  }).optional()
});

type CheckoutRequestBody = z.infer<typeof serverCheckoutSchema>;

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
    
        
    // Additional security: check for bot-like behavior
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousBots = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /postman/i
    ];
    
    if (suspiciousBots.some(pattern => pattern.test(userAgent))) {
            return NextResponse.json(
        {
          error: 'Access denied',
          code: 'BOT_DETECTED'
        },
        { status: 403, headers }
      );
    }

    // Debug environment variables in production (only log presence, not values)
    const debugInfo = {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasStripePublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
    };
    
        
    // Check for required Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
        {
          error: 'Server configuration error: Stripe secret key not configured',
          debug: debugInfo
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
            return NextResponse.json(
        {
          error: 'Server configuration error: Stripe publishable key not configured',
          debug: debugInfo
        },
        { status: 500 }
      );
    }

    // Get base URL with fallback for Netlify
    // For local development, use localhost; for production, use environment variables or Netlify
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.URL ||
        'https://lebve.netlify.app';
    
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

    // Enhanced security validation for all text fields
    const customerInfo = body.customerInfo;
    const allTextFields = [
      customerInfo.firstName,
      customerInfo.lastName,
      customerInfo.email,
      customerInfo.address,
      customerInfo.city,
      customerInfo.state,
      customerInfo.zipCode,
      customerInfo.phone || '',
      ...body.items.map(item => item.productName)
    ];

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
    
    // Validate CSRF token if provided
    if (body.csrfToken && !CSRFProtection.validateToken(body.csrfToken)) {
            return NextResponse.json(
        {
          error: 'Invalid security token',
          code: 'CSRF_INVALID'
        },
        { status: 403, headers }
      );
    }
    
    // Validate timestamp if security context provided
    if (body.securityContext) {
      const timeDiff = Date.now() - body.securityContext.timestamp;
      if (timeDiff > 300000) { // 5 minutes
        return NextResponse.json(
          {
            error: 'Request expired. Please refresh and try again.',
            code: 'REQUEST_EXPIRED'
          },
          { status: 400, headers }
        );
      }
    }

    // Format line items for Stripe with enhanced product data
    const lineItems = body.items.map(item => ({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        product_data: {
          name: item.productName,
          description: `Premium gut health supplement - Quantity: ${item.quantity}`,
          images: item.imageUrl ? [item.imageUrl] : undefined,
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
    const orderNumber = `FEG-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

  // Create metadata for the order with enhanced security logging
    const metadata = {
      order_number: orderNumber,
      customer_name: `${body.customerInfo.firstName} ${body.customerInfo.lastName}`.substring(0, 500),
      customer_email: body.customerInfo.email,
    shipping_address: JSON.stringify({
        line1: body.customerInfo.address,
        city: body.customerInfo.city,
        state: body.customerInfo.state,
        postal_code: body.customerInfo.zipCode,
        country: body.customerInfo.country
      }),
      customer_phone: body.customerInfo.phone || '',
      order_items: JSON.stringify(body.items.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        product_type: item.productName.toLowerCase().includes('plus') ? 'total_essential_plus' : 'total_essential'
      }))),
      security_validated: 'true',
      csrf_token_validated: body.csrfToken ? 'true' : 'false',
      client_ip: clientIP,
      user_agent: userAgent.substring(0, 100) // Limit length
    };

    // Create checkout session with comprehensive field collection
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: STRIPE_CONFIG.mode,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?cancelled=true`,
      
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
          description: `Order ${orderNumber} - Fibre Elite Glow Products`,
          metadata: {
            order_number: orderNumber,
            customer_email: body.customerInfo.email,
          },
          footer: 'Thank you for choosing Fibre Elite Glow! Questions? Contact support@lbve.ca',
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
        description: `Fibre Elite Glow Order ${orderNumber}`,
      },
      
      // Session expiration (24 hours)
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      
      // Automatic tax calculation (enable if configured)
      automatic_tax: {
        enabled: false, // Set to true if you have tax calculation configured in Stripe
      },
      
      // Custom text for checkout
      custom_text: {
        shipping_address: {
          message: 'Please provide accurate shipping information for timely delivery of your Fibre Elite Glow products.',
        },
        submit: {
          message: 'Complete your order to start your gut health journey with Fibre Elite Glow!',
        },
      },
    });

    // Try to store checkout session info in Supabase if available
    try {
      if (supabaseAdmin) {
        const { error } = await supabaseAdmin
          .from('checkout_sessions')
          .insert({
            session_id: session.id,
            customer_email: body.customerInfo.email,
            amount_total: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
            currency: session.currency || 'USD',
            payment_intent: session.payment_intent as string,
            metadata: metadata,
            status: session.status,
            payment_status: 'pending',
            test_mode: session.livemode === false,
            expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
            created_at: new Date().toISOString(),
          });
        
        if (error) {
                    // Continue with checkout even if storage fails
        } else {
                  }
      } else {
              }
    } catch (dbError) {
      // Log but don't fail the checkout if database storage fails
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
        
  // Use enhanced error handler with sanitization
    return GlobalErrorHandler.handleApiError(error);
  }
}