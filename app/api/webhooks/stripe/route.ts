import { NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/client';
import { emailService } from '@/lib/email-service';
import { inventoryService } from '@/lib/inventory-service';
import { GlobalErrorHandler, ErrorSanitizer } from '@/lib/error-handler';
import { emailSchema } from '@/lib/validation';
import { z } from 'zod';
import Stripe from 'stripe';

// Order item schema for webhook validation
const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  product_type: z.string().optional(),
});

// Shipping address schema for webhook validation
const shippingAddressSchema = z.object({
  line1: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
});

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

// Helper to ensure customer exists in database with enhanced validation
async function ensureCustomerExists(email: string, name?: string): Promise<string | null> {
  if (!supabaseAdmin) return null;

  try {
    // Validate and sanitize email
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      console.error('Invalid email provided to ensureCustomerExists:', email);
      return null;
    }
    const validEmail = emailValidation.data;

    // Sanitize name
    const sanitizedName = name ? name.replace(/[<>"'&]/g, '').trim().substring(0, 100) : '';

    // Rest of the function remains the same...
    const { data: existingCustomer, error: findError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', validEmail)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding customer:', findError);
      return null;
    }

    if (existingCustomer) {
      return existingCustomer.id;
    }

    // Create new customer if not found
    const [firstName, lastName] = sanitizedName ? sanitizedName.split(' ') : ['', ''];
    const { data: newCustomer, error: createError } = await supabaseAdmin
      .from('customers')
      .insert({
        email: validEmail,
        first_name: firstName.substring(0, 50) || '',
        last_name: lastName.substring(0, 50) || '',
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating customer:', createError);
      return null;
    }

    return newCustomer.id;
  } catch (error) {
    console.error('Error ensuring customer exists:', ErrorSanitizer.sanitizeMessage(error));
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
    // Security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');

    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.warn('Webhook request missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Validate signature format
    if (!signature.includes('t=') || !signature.includes('v1=')) {
      console.warn('Invalid Stripe signature format');
      return NextResponse.json(
        { error: 'Invalid signature format' },
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
        
        // Extract metadata and parse JSON fields safely with validation
        const metadata = session.metadata || {};
        
        // Validate and parse order items
        let orderItems: Array<{
          id: string;
          name: string;
          quantity: number;
          price: number;
          product_type?: string;
        }> = [];
        
        if (metadata.order_items) {
          try {
            const parsed = JSON.parse(metadata.order_items);
            const validation = z.array(orderItemSchema).safeParse(parsed);
            if (validation.success) {
              orderItems = validation.data;
            } else {
              console.warn('Invalid order items in webhook metadata');
            }
          } catch (error) {
            console.warn('Failed to parse order items JSON in webhook metadata');
          }
        }
        
        // Validate and parse shipping address
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
        
        if (metadata.shipping_address) {
          try {
            const parsed = JSON.parse(metadata.shipping_address);
            const validation = shippingAddressSchema.safeParse(parsed);
            if (validation.success) {
              shippingAddress = validation.data;
            } else {
              console.warn('Invalid shipping address in webhook metadata');
            }
          } catch (error) {
            console.warn('Failed to parse shipping address JSON in webhook metadata');
          }
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
        const customerName = metadata.customer_name || session.customer_details?.name || undefined;
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
          
          // Shipping address from metadata
          shipping_first_name: shippingAddress.first_name || '',
          shipping_last_name: shippingAddress.last_name || '',
          shipping_address_line_1: shippingAddress.line1 || '',
          shipping_address_line_2: shippingAddress.line2 || '',
          shipping_city: shippingAddress.city || '',
          shipping_state_province: shippingAddress.state || '',
          shipping_postal_code: shippingAddress.postal_code || '',
          shipping_country: shippingAddress.country || 'US',
          
          // Billing address (same as shipping for now)
          billing_first_name: shippingAddress.first_name || '',
          billing_last_name: shippingAddress.last_name || '',
          billing_address_line_1: shippingAddress.line1 || '',
          billing_address_line_2: shippingAddress.line2 || '',
          billing_city: shippingAddress.city || '',
          billing_state_province: shippingAddress.state || '',
          billing_postal_code: shippingAddress.postal_code || '',
          billing_country: shippingAddress.country || 'US',
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

        console.log(`Order created successfully: ${order?.id} (${order?.order_number})`);

        // Update inventory for order items
        if (orderItems.length > 0) {
          try {
            // Convert orderItems to proper OrderItem format
            const typedOrderItems = orderItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              product_type: (item.product_type === 'total_essential_plus' ? 'total_essential_plus' : 'total_essential') as 'total_essential' | 'total_essential_plus'
            }));
            
            const inventoryUpdated = await inventoryService.updateInventoryForOrder(typedOrderItems);
            if (inventoryUpdated) {
              console.log('Inventory updated successfully for order:', order?.order_number);
            } else {
              console.warn('Some inventory updates may have failed for order:', order?.order_number);
            }
          } catch (inventoryError) {
            console.error('Error updating inventory:', inventoryError);
            // Don't fail the webhook if inventory update fails
          }
        }

        // Send order confirmation email
        if (order && customerEmail) {
          try {
            await emailService.sendOrderConfirmation({
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
            });
            console.log(`Order confirmation email sent to ${customerEmail}`);
          } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the webhook if email fails
          }
        }

        // Send admin notification email
        if (order && customerEmail && orderItems.length > 0) {
          try {
            const customerFullName = metadata.customer_name || `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || 'Unknown Customer';
            
            // Convert orderItems to proper OrderItem format for admin notification
            const typedOrderItems = orderItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              product_type: (item.product_type === 'total_essential_plus' ? 'total_essential_plus' : 'total_essential') as 'total_essential' | 'total_essential_plus'
            }));
            
            await emailService.sendAdminOrderNotification({
              orderNumber: order.order_number,
              customerEmail,
              customerName: customerFullName,
              totalAmount: session.amount_total || 0,
              currency: session.currency || 'usd',
              items: typedOrderItems,
              shippingAddress: {
                firstName: shippingAddress.first_name || '',
                lastName: shippingAddress.last_name || '',
                addressLine1: shippingAddress.line1 || '',
                addressLine2: shippingAddress.line2,
                city: shippingAddress.city || '',
                state: shippingAddress.state || '',
                postalCode: shippingAddress.postal_code || '',
                country: shippingAddress.country || 'US',
              },
              paymentIntentId: session.payment_intent as string,
              createdAt: new Date().toISOString(),
            });
            console.log('Admin notification email sent for order:', order.order_number);
          } catch (adminEmailError) {
            console.error('Failed to send admin notification email:', adminEmailError);
            // Don't fail the webhook if admin email fails
          }
        }
        
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
    console.error('Webhook error:', ErrorSanitizer.sanitizeMessage(error));
    return GlobalErrorHandler.handleApiError(error);
  }
}
