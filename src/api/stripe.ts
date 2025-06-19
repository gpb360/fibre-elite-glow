import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import type { CartItem } from '@/types/cart';

export interface CheckoutSessionRequest {
  items: CartItem[];
  customerInfo: {
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
  };
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface OrderDetails {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(
  request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  try {
    // Convert cart items to Stripe line items
    const lineItems = request.items.map((item) => ({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        product_data: {
          name: item.productName,
          description: item.description || `${item.productName} - Premium gut health supplement`,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Generate order number
    const orderNumber = `FEG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: STRIPE_CONFIG.payment_method_types,
      line_items: lineItems,
      mode: STRIPE_CONFIG.mode,
      success_url: STRIPE_CONFIG.success_url,
      cancel_url: STRIPE_CONFIG.cancel_url,
      customer_email: request.customerInfo.email,
      
      // Add customer information to metadata
      metadata: {
        orderNumber,
        customerFirstName: request.customerInfo.firstName,
        customerLastName: request.customerInfo.lastName,
        customerEmail: request.customerInfo.email,
        shippingAddress: JSON.stringify(request.customerInfo.address),
      },
      
      // Shipping address collection
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      
      // Billing address collection
      billing_address_collection: 'required',
      
      // Phone number collection
      phone_number_collection: {
        enabled: true,
      },
      
      // Custom fields for additional information
      custom_fields: [
        {
          key: 'order_notes',
          label: {
            type: 'custom',
            custom: 'Order Notes (Optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
      
      // Automatic tax calculation (if enabled in Stripe)
      automatic_tax: {
        enabled: false, // Set to true if you have tax calculation enabled
      },
      
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    if (!session.id || !session.url) {
      throw new Error('Failed to create checkout session');
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error(
      error instanceof Error 
        ? `Checkout session creation failed: ${error.message}`
        : 'Failed to create checkout session'
    );
  }
}

/**
 * Retrieve checkout session details
 */
export async function getCheckoutSession(sessionId: string): Promise<OrderDetails> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    if (!session) {
      throw new Error('Checkout session not found');
    }

    // Extract order details from session
    const orderDetails: OrderDetails = {
      id: session.id,
      orderNumber: session.metadata?.orderNumber || `FEG-${session.id.slice(-8).toUpperCase()}`,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: session.payment_status === 'paid' ? 'confirmed' : session.payment_status || 'pending',
      customerEmail: session.customer_email || session.metadata?.customerEmail || '',
      items: [],
      createdAt: new Date(session.created * 1000).toISOString(),
    };

    // Extract line items
    if (session.line_items?.data) {
      orderDetails.items = session.line_items.data.map((item) => ({
        name: item.description || 'Product',
        quantity: item.quantity || 1,
        price: (item.amount_total || 0) / 100 / (item.quantity || 1), // Convert from cents and calculate unit price
      }));
    }

    return orderDetails;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to retrieve order details: ${error.message}`
        : 'Failed to retrieve order details'
    );
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(
  body: string,
  signature: string
): Promise<{ received: boolean; event?: any }> {
  try {
    if (!STRIPE_CONFIG.webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true, event };
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: any) {
  console.log('Checkout session completed:', session.id);
  
  // Here you would typically:
  // 1. Save order to database
  // 2. Send confirmation email
  // 3. Update inventory
  // 4. Trigger fulfillment process
  
  // For now, just log the event
  console.log('Order details:', {
    sessionId: session.id,
    orderNumber: session.metadata?.orderNumber,
    customerEmail: session.customer_email,
    amount: session.amount_total,
    currency: session.currency,
  });
}

/**
 * Handle successful payment
 */
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  // Update order status to paid
  // Send payment confirmation
}

/**
 * Handle failed payment
 */
async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment failed:', paymentIntent.id);
  
  // Update order status to failed
  // Send payment failure notification
  // Optionally retry payment or offer alternative payment methods
}
