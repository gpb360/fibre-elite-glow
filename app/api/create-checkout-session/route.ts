import { NextResponse } from 'next/server';
import {
  stripe,
  formatAmountForStripe,
  STRIPE_CONFIG
} from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/client';

// Define types for the request body
interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface CheckoutRequestBody {
  items: CartItem[];
  customerInfo: CustomerInfo;
}

export async function POST(request: Request) {
  try {
    // Debug environment variables in production (only log presence, not values)
    const debugInfo = {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasStripePublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
    };
    
    console.log('Environment check:', debugInfo);
    
    // Check for required Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY environment variable is missing');
      return NextResponse.json(
        {
          error: 'Server configuration error: Stripe secret key not configured',
          debug: debugInfo
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is missing');
      return NextResponse.json(
        {
          error: 'Server configuration error: Stripe publishable key not configured',
          debug: debugInfo
        },
        { status: 500 }
      );
    }

    // Get base URL with fallback for Netlify
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                   process.env.URL ||
                   'https://lebve.netlify.app';
    
    // Parse and validate request body
    const rawBody = await request.json();

    // Basic validation without Zod schema to avoid mismatch
    if (!rawBody.items || !Array.isArray(rawBody.items) || rawBody.items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!rawBody.customerInfo || !rawBody.customerInfo.email) {
      return NextResponse.json(
        { error: 'Customer information with email is required' },
        { status: 400 }
      );
    }

    // Validate each item has required fields
    for (const item of rawBody.items) {
      if (!item.id || !item.productName || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return NextResponse.json(
          { error: 'Each item must have id, productName, price, and quantity' },
          { status: 400 }
        );
      }
    }
    
    const body = rawBody as CheckoutRequestBody;

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

    // Create comprehensive metadata for the order (Stripe has 500 character limit per value)
    const orderItems = body.items.map(item => ({
      id: item.id,
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      product_type: item.productName.toLowerCase().includes('plus') ? 'total_essential_plus' : 'total_essential'
    }));

    const metadata = {
      order_number: orderNumber,
      customer_name: `${body.customerInfo.firstName} ${body.customerInfo.lastName}`.substring(0, 500),
      customer_email: body.customerInfo.email,
      shipping_address: JSON.stringify(body.customerInfo.address).substring(0, 500),
      order_items: JSON.stringify(orderItems).substring(0, 500),
      order_type: 'ecommerce',
      source: 'website',
      total_items: body.items.length.toString()
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
      
      // Require legal compliance
      consent_collection: {
        terms_of_service: 'required',
        privacy_policy: 'required',
      },
      
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
      
      // Shipping options (uncomment and configure if you have shipping rates set up)
      // shipping_options: [
      //   {
      //     shipping_rate_data: {
      //       type: 'fixed_amount',
      //       fixed_amount: {
      //         amount: 500, // $5.00 shipping
      //         currency: STRIPE_CONFIG.currency,
      //       },
      //       display_name: 'Standard Shipping',
      //       delivery_estimate: {
      //         minimum: {
      //           unit: 'business_day',
      //           value: 3,
      //         },
      //         maximum: {
      //           unit: 'business_day',
      //           value: 7,
      //         },
      //       },
      //     },
      //   },
      //   {
      //     shipping_rate_data: {
      //       type: 'fixed_amount',
      //       fixed_amount: {
      //         amount: 1500, // $15.00 express shipping
      //         currency: STRIPE_CONFIG.currency,
      //       },
      //       display_name: 'Express Shipping',
      //       delivery_estimate: {
      //         minimum: {
      //           unit: 'business_day',
      //           value: 1,
      //         },
      //         maximum: {
      //           unit: 'business_day',
      //           value: 2,
      //         },
      //       },
      //     },
      //   },
      // ],
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
          console.error('Error storing checkout session in Supabase:', error);
          // Continue with checkout even if storage fails
        } else {
          console.log(`✅ Checkout session stored: ${session.id} for order ${orderNumber}`);
        }
      } else {
        console.warn('Supabase admin client not available - skipping session storage');
      }
    } catch (dbError) {
      // Log but don't fail the checkout if database storage fails
      console.error('Failed to store checkout session:', dbError);
    }

    // Log successful session creation with enhanced details
    console.log(`✅ Enhanced checkout session created: ${session.id}`);
    console.log(`📧 Customer: ${body.customerInfo.email}`);
    console.log(`📦 Order: ${orderNumber}`);
    console.log(`💰 Total: ${session.amount_total ? (session.amount_total / 100) : 0} ${session.currency?.toUpperCase()}`);
    console.log(`🎯 Fields collected: billing address, shipping address, phone number, terms acceptance`);

    // Return the checkout session URL with order information
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      orderNumber: orderNumber,
      fieldsEnabled: [
        'billing_address',
        'shipping_address', 
        'phone_number',
        'terms_of_service',
        'privacy_policy',
        'promotion_codes'
      ]
    });
    
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // Provide more specific error information
    let errorMessage = 'Failed to create checkout session';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific Stripe errors
      if (error.message.includes('No such plan') || error.message.includes('No such price')) {
        errorMessage = 'Invalid product configuration. Please contact support.';
      } else if (error.message.includes('Invalid API key')) {
        errorMessage = 'Server configuration error: Invalid Stripe API key';
      } else if (error.message.includes('Could not create Stripe client')) {
        errorMessage = 'Server configuration error: Stripe client initialization failed';
      } else if (error.message.includes('Invalid country')) {
        errorMessage = 'Shipping not available to your location. Please contact support.';
      } else if (error.message.includes('consent_collection')) {
        errorMessage = 'Legal compliance configuration error. Please contact support.';
      }
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        type: error instanceof Error ? error.constructor.name : 'Unknown',
        orderNumber: null
      },
      { status: 500 }
    );
  }
}