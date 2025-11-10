// Stripe Webhook Handler - Fixed to use Supabase send-email function
// This replaces the current email sending logic with a call to your Supabase edge function

const Stripe = require('stripe');
const cors = require('cors');

// Environment variables (set these in Netlify)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@lbve.ca';

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}
if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}
if (!SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_KEY is required');
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

// Helper function to call Supabase send-email function
async function sendEmailViaSupabase(emailType, recipient, orderData) {
  try {
    console.log(`Sending ${emailType} email to ${recipient} via Supabase function...`);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({
        type: emailType,
        to: recipient,
        data: orderData
      })
    });

    const result = await response.text();
    console.log(`Supabase email response (${response.status}):`, result);

    if (!response.ok) {
      console.error(`Email service error: ${response.status} - ${result}`);
      return { success: false, error: result };
    }

    return { success: true, response: result };
  } catch (error) {
    console.error('Failed to call Supabase email function:', error);
    return { success: false, error: error.message };
  }
}

// Extract order data from Stripe session
function extractOrderData(session) {
  return {
    sessionId: session.id,
    customerEmail: session.customer_email,
    customerName: session.customer_details?.name || 'Customer',
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    currency: session.currency,
    paymentMethodTypes: session.payment_method_types,
    shippingAddress: session.shipping_details?.address,
    billingAddress: session.customer_details?.address,
    orderUrl: session.url,
    // Extract metadata if available
    customFields: session.metadata || {}
  };
}

// Handle checkout.session.completed event
async function handleCheckoutCompleted(session) {
  console.log('Processing checkout session completed:', session.id);
  
  try {
    // Extract order data
    const orderData = extractOrderData(session);
    
    // Send order confirmation email to customer (non-blocking)
    if (orderData.customerEmail) {
      sendEmailViaSupabase('order_confirmation', orderData.customerEmail, orderData)
        .then(result => {
          if (result.success) {
            console.log('✅ Customer confirmation email sent successfully');
          } else {
            console.warn('⚠️ Customer confirmation email failed:', result.error);
          }
        })
        .catch(error => {
          console.warn('⚠️ Customer confirmation email error:', error);
        });
    }
    
    // Send admin notification (non-blocking)
    if (ADMIN_EMAIL) {
      sendEmailViaSupabase('admin_notification', ADMIN_EMAIL, {
        ...orderData,
        adminNote: 'New order received via Stripe checkout'
      })
      .then(result => {
        if (result.success) {
          console.log('✅ Admin notification email sent successfully');
        } else {
          console.warn('⚠️ Admin notification email failed:', result.error);
        }
      })
      .catch(error => {
        console.warn('⚠️ Admin notification email error:', error);
      });
    }
    
    // Add any additional processing here (e.g., database updates, inventory management)
    
    console.log('✅ Checkout session processed successfully');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Checkout session processed successfully',
        sessionId: session.id 
      })
    };
    
  } catch (error) {
    console.error('Error processing checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process checkout session',
        details: error.message 
      })
    };
  }
}

// Handle payment_intent.payment_failed event
async function handlePaymentFailed(paymentIntent) {
  console.log('Processing payment failed:', paymentIntent.id);
  
  try {
    const orderData = {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      lastError: paymentIntent.last_payment_error?.message || 'Unknown error',
      customerEmail: paymentIntent.receipt_email
    };
    
    // Send failure notification to admin (non-blocking)
    if (ADMIN_EMAIL) {
      sendEmailViaSupabase('payment_failed', ADMIN_EMAIL, {
        ...orderData,
        adminNote: 'Payment failed - requires attention'
      })
      .then(result => {
        if (result.success) {
          console.log('✅ Payment failure notification sent');
        } else {
          console.warn('⚠️ Payment failure notification failed:', result.error);
        }
      })
      .catch(error => {
        console.warn('⚠️ Payment failure notification error:', error);
      });
    }
    
    console.log('✅ Payment failure processed');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Payment failure processed',
        paymentIntentId: paymentIntent.id 
      })
    };
    
  } catch (error) {
    console.error('Error processing payment failure:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process payment failure',
        details: error.message 
      })
    };
  }
}

// Main webhook handler
exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify webhook signature
    const sig = event.headers['stripe-signature'];
    if (!sig || !STRIPE_WEBHOOK_SECRET) {
      console.error('Missing Stripe webhook signature or secret');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing signature or secret' })
      };
    }

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature' })
      };
    }

    console.log('📨 Received Stripe webhook event:', stripeEvent.type);

    // Handle different event types
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        return await handleCheckoutCompleted(stripeEvent.data.object);
        
      case 'payment_intent.payment_failed':
        return await handlePaymentFailed(stripeEvent.data.object);
        
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            message: `Event type ${stripeEvent.type} received but not handled`,
            type: stripeEvent.type 
          })
        };
    }

  } catch (error) {
    console.error('Webhook handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};

// Test endpoint for diagnostics (optional)
exports.diagnostics = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'Webhook function is running',
      environment: {
        hasStripeKey: !!STRIPE_SECRET_KEY,
        hasWebhookSecret: !!STRIPE_WEBHOOK_SECRET,
        hasSupabaseUrl: !!SUPABASE_URL,
        hasSupabaseKey: !!SUPABASE_SERVICE_KEY,
        adminEmail: ADMIN_EMAIL
      },
      timestamp: new Date().toISOString()
    })
  };
};