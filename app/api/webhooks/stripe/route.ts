import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/client';
import Stripe from 'stripe';

// Helper to get Stripe webhook secret from Supabase secrets
async function getWebhookSecret(): Promise<string> {
  try {
    // Try to get the webhook secret from Supabase secrets
    const { data, error } = await supabaseAdmin
      .from('secrets')
      .select('value')
      .eq('key', 'STRIPE_WEBHOOK_SECRET')
      .single();

    if (error || !data) {
      // Fall back to environment variable if Supabase secret not available
      const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!envSecret) {
        throw new Error('Stripe webhook secret not found in Supabase secrets or environment variables');
      }
      return envSecret;
    }

    return data.value;
  } catch (error) {
    console.error('Error retrieving webhook secret:', error);
    // Fall back to environment variable
    const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!envSecret) {
      throw new Error('Stripe webhook secret not found');
    }
    return envSecret;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Get webhook secret
    const webhookSecret = await getWebhookSecret();
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract metadata
        const metadata = session.metadata || {};
        let orderItems: any[] = [];
        let shippingAddress: any = {};
        
        try {
          if (metadata.order_items) {
            orderItems = JSON.parse(metadata.order_items);
          }
          
          if (metadata.shipping_address) {
            shippingAddress = JSON.parse(metadata.shipping_address);
          }
        } catch (parseError) {
          console.error('Error parsing session metadata:', parseError);
        }

        // Update checkout session status in database
        const { error: sessionUpdateError } = await supabaseAdmin
          .from('checkout_sessions')
          .update({ status: session.status, updated_at: new Date().toISOString() })
          .eq('session_id', session.id);

        if (sessionUpdateError) {
          console.error('Error updating checkout session:', sessionUpdateError);
        }

        // Create order record
        const { data: orderData, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            session_id: session.id,
            customer_email: session.customer_details?.email || metadata.customer_email,
            customer_name: metadata.customer_name || `${session.customer_details?.name || 'Unknown'}`,
            amount_total: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
            currency: session.currency || 'usd',
            payment_status: session.payment_status,
            shipping_address: shippingAddress,
            items: orderItems,
            metadata: metadata,
            status: 'confirmed',
            payment_intent: session.payment_intent as string,
            test_mode: STRIPE_CONFIG.testMode,
          })
          .select('id')
          .single();

        if (orderError) {
          console.error('Error creating order record:', orderError);
          return NextResponse.json(
            { error: 'Error creating order record' },
            { status: 500 }
          );
        }

        console.log(`Order created successfully: ${orderData?.id}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update checkout session status in database
        const { error: sessionUpdateError } = await supabaseAdmin
          .from('checkout_sessions')
          .update({ 
            status: 'expired', 
            updated_at: new Date().toISOString() 
          })
          .eq('session_id', session.id);

        if (sessionUpdateError) {
          console.error('Error updating expired checkout session:', sessionUpdateError);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find associated checkout session
        const { data: sessionData } = await supabaseAdmin
          .from('checkout_sessions')
          .select('*')
          .eq('payment_intent', paymentIntent.id)
          .single();

        if (sessionData) {
          // Update checkout session status
          const { error: updateError } = await supabaseAdmin
            .from('checkout_sessions')
            .update({ 
              status: 'payment_failed', 
              updated_at: new Date().toISOString(),
              failure_reason: paymentIntent.last_payment_error?.message || 'Unknown error'
            })
            .eq('session_id', sessionData.session_id);

          if (updateError) {
            console.error('Error updating failed payment session:', updateError);
          }
        }
        break;
      }

      default:
        // Log but ignore other event types
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
