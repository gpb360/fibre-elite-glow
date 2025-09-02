import { NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/client';
import { emailService } from '@/lib/email-service';
import Stripe from 'stripe';

// Helper to get Stripe webhook secret from Supabase secrets
async function getWebhookSecret(): Promise<string> {
  try {
    // Try to get the webhook secret from Supabase secrets
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('secrets')
        .select('value')
        .eq('key', 'STRIPE_WEBHOOK_SECRET')
        .single();

      if (!error && data) {
        return data.value;
      }
    }

    // Fall back to environment variable if Supabase secret not available
    const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!envSecret) {
      throw new Error('Stripe webhook secret not found in Supabase secrets or environment variables');
    }
    return envSecret;
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

// Helper to ensure customer exists in database
async function ensureCustomerExists(email: string, name?: string): Promise<string | null> {
  if (!supabaseAdmin) return null;

  try {
    // First, try to find existing customer
    const { data: existingCustomer, error: findError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error finding customer:', findError);
      return null;
    }

    if (existingCustomer) {
      return existingCustomer.id;
    }

    // Create new customer if not found
    const [firstName, lastName] = name ? name.split(' ') : ['', ''];
    const { data: newCustomer, error: createError } = await supabaseAdmin
      .from('customers')
      .insert({
        email,
        first_name: firstName || '',
        last_name: lastName || '',
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating customer:', createError);
      return null;
    }

    return newCustomer.id;
  } catch (error) {
    console.error('Error ensuring customer exists:', error);
    return null;
  }
}

// Helper to generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FEG-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

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
        
        // Extract metadata and parse JSON fields safely
        const metadata = session.metadata || {};
        let orderItems: Array<{
          id: string;
          name: string;
          quantity: number;
          price: number;
          product_type?: string;
        }> = [];
        let shippingAddress: {
          first_name?: string;
          last_name?: string;
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
        } = {};
        
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

        if (!supabaseAdmin) {
          console.error('Supabase admin client not available - cannot process checkout session completion');
          return NextResponse.json(
            { error: 'Database unavailable' },
            { status: 500 }
          );
        }

        // Ensure customer exists in database
        const customerEmail = session.customer_details?.email || metadata.customer_email || '';
        const customerName = metadata.customer_name || session.customer_details?.name || '';
        const customerId = await ensureCustomerExists(customerEmail, customerName);

        // Update checkout session status in database
        const { error: sessionUpdateError } = await supabaseAdmin
          .from('checkout_sessions')
          .update({ 
            status: session.status, 
            payment_status: session.payment_status,
            updated_at: new Date().toISOString() 
          })
          .eq('session_id', session.id);

        if (sessionUpdateError) {
          console.error('Error updating checkout session:', sessionUpdateError);
        }

        // Generate order number if not present in metadata
        const orderNumber = metadata.order_number || generateOrderNumber();

        // Create comprehensive order record
        const orderData = {
          order_number: orderNumber,
          session_id: session.id,
          customer_id: customerId,
          email: customerEmail,
          status: 'pending' as const,
          payment_status: session.payment_status === 'paid' ? 'paid' as const : 'pending' as const,
          subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
          total_amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase() || 'USD',
          payment_intent: session.payment_intent as string,
          metadata: metadata,
          test_mode: STRIPE_CONFIG.testMode,
          
          // Shipping address from metadata or session customer details
          shipping_first_name: shippingAddress.first_name || session.customer_details?.name?.split(' ')[0] || '',
          shipping_last_name: shippingAddress.last_name || session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
          shipping_address_line_1: shippingAddress.line1 || session.customer_details?.address?.line1 || '',
          shipping_address_line_2: shippingAddress.line2 || session.customer_details?.address?.line2 || '',
          shipping_city: shippingAddress.city || session.customer_details?.address?.city || '',
          shipping_state_province: shippingAddress.state || session.customer_details?.address?.state || '',
          shipping_postal_code: shippingAddress.postal_code || session.customer_details?.address?.postal_code || '',
          shipping_country: shippingAddress.country || session.customer_details?.address?.country || 'US',
          
          // Billing address from session
          billing_first_name: session.customer_details?.name?.split(' ')[0] || '',
          billing_last_name: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
          billing_address_line_1: session.customer_details?.address?.line1 || '',
          billing_address_line_2: session.customer_details?.address?.line2 || '',
          billing_city: session.customer_details?.address?.city || '',
          billing_state_province: session.customer_details?.address?.state || '',
          billing_postal_code: session.customer_details?.address?.postal_code || '',
          billing_country: session.customer_details?.address?.country || 'US',
        };

        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert(orderData)
          .select('id, order_number')
          .single();

        if (orderError) {
          console.error('Error creating order record:', orderError);
          return NextResponse.json(
            { error: 'Error creating order record' },
            { status: 500 }
          );
        }

        // Create order items
        if (orderItems.length > 0 && order) {
          const orderItemsData = orderItems.map(item => ({
            order_id: order.id,
            product_name: item.name,
            product_type: (item.product_type || 'total_essential') as 'total_essential' | 'total_essential_plus',
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          }));

          const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItemsData);

          if (itemsError) {
            console.error('Error creating order items:', itemsError);
          }
        }

        console.log(`✅ Order created successfully: ${order?.id} (${order?.order_number})`);

        // Prepare notification data for admin email
        const adminNotificationData = {
          orderNumber: orderNumber,
          customerEmail: customerEmail,
          customerName: customerName,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase() || 'USD',
          items: orderItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          paymentStatus: session.payment_status || 'unknown',
          createdAt: new Date().toISOString(),
        };

        // Send emails concurrently for better performance
        const emailPromises = [];

        // Send order confirmation email to customer
        if (order && customerEmail) {
          emailPromises.push(
            emailService.sendOrderConfirmation({
              id: order.id,
              orderNumber: order.order_number,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'confirmed',
              customerEmail,
              items: orderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              createdAt: new Date().toISOString(),
            }).catch(error => {
              console.error('Failed to send customer order confirmation:', error);
              return false;
            })
          );
        }

        // Send admin notification email
        emailPromises.push(
          emailService.sendAdminOrderNotification(adminNotificationData).catch(error => {
            console.error('Failed to send admin order notification:', error);
            return false;
          })
        );

        // Execute email sending
        const emailResults = await Promise.allSettled(emailPromises);
        
        // Log email results
        emailResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const emailType = index === 0 ? 'customer confirmation' : 'admin notification';
            console.log(`📧 ${emailType} email: ${result.value ? 'sent' : 'failed'}`);
          } else {
            console.error(`📧 Email promise rejected:`, result.reason);
          }
        });
        
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!supabaseAdmin) {
          console.warn('Supabase admin client not available - cannot update expired session');
          break;
        }

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

        console.log(`⏰ Checkout session expired: ${session.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        if (!supabaseAdmin) {
          console.warn('Supabase admin client not available - cannot update failed payment');
          break;
        }

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

          // Send admin notification for payment failure
          try {
            const metadata = (sessionData.metadata || {}) as Record<string, string>;
            await emailService.sendAdminPaymentFailureNotification({
              orderNumber: metadata.order_number || 'Unknown',
              customerEmail: sessionData.customer_email || 'Unknown',
              customerName: metadata.customer_name || 'Unknown',
              amount: sessionData.amount_total || 0,
              currency: sessionData.currency || 'USD',
              error: paymentIntent.last_payment_error?.message || 'Payment failed',
              paymentStatus: 'failed',
              createdAt: new Date().toISOString(),
              items: []
            });
            console.log(`📧 Admin payment failure notification sent for payment intent: ${paymentIntent.id}`);
          } catch (emailError) {
            console.error('Failed to send admin payment failure notification:', emailError);
          }
        }

        console.log(`❌ Payment failed: ${paymentIntent.id} - ${paymentIntent.last_payment_error?.message || 'Unknown error'}`);
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log(`⚠️ Dispute created: ${dispute.id} - Amount: ${dispute.amount / 100} ${dispute.currency.toUpperCase()}`);
        
        // TODO: Send admin dispute notification
        // This would require implementing sendAdminDisputeNotification in email service
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`💰 Invoice paid: ${invoice.id} - Amount: ${(invoice.amount_paid || 0) / 100} ${invoice.currency?.toUpperCase()}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`📋 Subscription ${event.type}: ${subscription.id} - Status: ${subscription.status}`);
        
        // TODO: Handle subscription events if you add subscription products
        break;
      }

      default:
        // Log but ignore other event types
        console.log(`📝 Unhandled event type: ${event.type}`);
    }

    // Return success response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
