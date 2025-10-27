import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/client';
import { inventoryService } from '@/lib/inventory-service';
import { simpleEmailService } from '@/lib/simple-email-service';
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


// Email content generation functions
function generateOrderConfirmationHTML(params: {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
}): string {
  const itemsHtml = params.items
    .map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${formatCurrency(item.price * item.quantity, params.currency)}
        </td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
          .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
          .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; color: #28a745; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order. We're excited to get your La Belle Vie products to you!</p>
          </div>

          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${params.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> Confirmed</p>

            <h3>Items Ordered</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <p class="total">Total: ${formatCurrency(params.totalAmount, params.currency)}</p>
          </div>

          <div class="order-details">
            <h2>What's Next?</h2>
            <ol>
              <li><strong>Processing:</strong> Your order is being prepared (1-2 business days)</li>
              <li><strong>Shipping:</strong> You'll receive tracking information once shipped</li>
              <li><strong>Delivery:</strong> Your package will arrive within 3-7 business days</li>
            </ol>
          </div>

          <div class="footer">
            <p>Questions? Contact our support team at support@fibreeliteglow.com</p>
            <p>La Belle Vie - Premium Gut Health Solutions</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateOrderConfirmationText(params: {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
}): string {
  const itemsText = params.items
    .map(item => `${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity, params.currency)}`)
    .join('\n');

  return `
Order Confirmation - ${params.orderNumber}

Thank you for your order! Here are your order details:

Order Number: ${params.orderNumber}
Order Date: ${new Date().toLocaleDateString()}
Status: Confirmed

Items Ordered:
${itemsText}

Total: ${formatCurrency(params.totalAmount, params.currency)}

What's Next?
1. Processing: Your order is being prepared (1-2 business days)
2. Shipping: You'll receive tracking information once shipped
3. Delivery: Your package will arrive within 3-7 business days

Questions? Contact our support team at support@fibreeliteglow.com

La Belle Vie - Premium Gut Health Solutions
  `;
}

function generateAdminNotificationHTML(params: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentIntentId?: string;
}): string {
  const itemsHtml = params.items
    .map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${formatCurrency(item.price * item.quantity, params.currency)}
        </td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 8px; }
          .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
          .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; color: #dc3545; }
          .action-items { background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .action-item { background: white; padding: 10px; margin: 8px 0; border-left: 4px solid #007bff; }
          .customer-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Order Alert</h1>
            <p>A new order has been placed and requires your attention</p>
          </div>

          <div class="alert">
            <strong>⚡ Action Required:</strong> Process order ${params.orderNumber} - Customer: ${params.customerEmail}
          </div>

          <div class="order-details">
            <h2>Order Summary</h2>
            <p><strong>Order Number:</strong> ${params.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            ${params.paymentIntentId ? `<p><strong>Payment Intent:</strong> ${params.paymentIntentId}</p>` : ''}

            <div class="customer-info">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${params.customerName}</p>
              <p><strong>Email:</strong> ${params.customerEmail}</p>
              <p><strong>Shipping Address:</strong><br>
                ${params.shippingAddress.firstName} ${params.shippingAddress.lastName}<br>
                ${params.shippingAddress.addressLine1}<br>
                ${params.shippingAddress.addressLine2 ? params.shippingAddress.addressLine2 + '<br>' : ''}
                ${params.shippingAddress.city}, ${params.shippingAddress.state} ${params.shippingAddress.postalCode}<br>
                ${params.shippingAddress.country}
              </p>
            </div>

            <h3>Items Ordered</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <p class="total">Order Total: ${formatCurrency(params.totalAmount, params.currency)}</p>
          </div>

          <div class="action-items">
            <h3>📋 Action Items</h3>
            <div class="action-item">
              <strong>1. Verify Inventory:</strong> Check stock levels for all ordered items
            </div>
            <div class="action-item">
              <strong>2. Process Payment:</strong> Confirm payment has been processed successfully
            </div>
            <div class="action-item">
              <strong>3. Prepare Shipment:</strong> Package items and prepare shipping label
            </div>
            <div class="action-item">
              <strong>4. Update Customer:</strong> Send tracking information once shipped
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p><strong>La Belle Vie Admin Panel</strong></p>
            <p>Order processing system notification</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateAdminNotificationText(params: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentIntentId?: string;
}): string {
  const itemsText = params.items
    .map(item => `${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity, params.currency)}`)
    .join('\n');

  return `
NEW ORDER ALERT - ${params.orderNumber}

⚡ ACTION REQUIRED: Process new order

Order Details:
- Order Number: ${params.orderNumber}
- Order Date: ${new Date().toLocaleString()}
${params.paymentIntentId ? `- Payment Intent: ${params.paymentIntentId}` : ''}

Customer Information:
- Name: ${params.customerName}
- Email: ${params.customerEmail}

Shipping Address:
${params.shippingAddress.firstName} ${params.shippingAddress.lastName}
${params.shippingAddress.addressLine1}
${params.shippingAddress.addressLine2 ? params.shippingAddress.addressLine2 + '\n' : ''}${params.shippingAddress.city}, ${params.shippingAddress.state} ${params.shippingAddress.postalCode}
${params.shippingAddress.country}

Items Ordered:
${itemsText}

Order Total: ${formatCurrency(params.totalAmount, params.currency)}

📋 ACTION ITEMS:
1. Verify Inventory: Check stock levels for all ordered items
2. Process Payment: Confirm payment has been processed successfully
3. Prepare Shipment: Package items and prepare shipping label
4. Update Customer: Send tracking information once shipped

La Belle Vie Admin Panel
Order processing system notification
  `;
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
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

    // Development bypass for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const testBypass = request.headers.get('x-test-bypass') === 'true';

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      if (isDevelopment && testBypass) {
        console.log('🧪 Development mode: Bypassing webhook signature verification for testing');
        // Parse the body directly for testing
        event = JSON.parse(body);
      } else {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      }
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
        const customerPhone = metadata.customer_phone || session.customer_details?.phone || undefined;
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
          stripe_payment_intent_id: session.payment_intent as string,

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

        // Send order confirmation email via simple email service
        if (order && customerEmail) {
          const customerFullName = metadata.customer_name || `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || 'Valued Customer';

          console.log(`📧 Sending order confirmation to: ${customerEmail}`);
          try {
            const orderConfirmationSent = await simpleEmailService.sendOrderConfirmation({
              orderNumber: order.order_number,
              customerEmail,
              customerName: customerFullName,
              items: orderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              totalAmount: (session.amount_total || 0) / 100,
              currency: session.currency?.toUpperCase() || 'USD',
              customerPhone: customerPhone,
              shippingAddress: shippingAddress ? {
                firstName: shippingAddress.first_name || '',
                lastName: shippingAddress.last_name || '',
                addressLine1: shippingAddress.line1 || '',
                addressLine2: shippingAddress.line2 || '',
                city: shippingAddress.city || '',
                state: shippingAddress.state || '',
                postalCode: shippingAddress.postal_code || '',
                country: shippingAddress.country || 'US'
              } : undefined
            });

            if (orderConfirmationSent) {
              console.log(`✅ Order confirmation email sent to: ${customerEmail}`);
            } else {
              console.error(`❌ Failed to send order confirmation to: ${customerEmail}`);
            }
          } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
          }
        }

        // Send admin notification email via simple email service
        if (order && customerEmail && orderItems.length > 0) {
          const customerFullName = metadata.customer_name || `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || 'Unknown Customer';

          console.log(`📧 Sending admin notification for order: ${order.order_number}`);
          try {
            const adminNotificationSent = await simpleEmailService.sendAdminNotification({
              orderNumber: order.order_number,
              customerEmail,
              customerName: customerFullName,
              items: orderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              totalAmount: (session.amount_total || 0) / 100,
              currency: session.currency?.toUpperCase() || 'USD',
              customerPhone: customerPhone,
              shippingAddress: shippingAddress ? {
                firstName: shippingAddress.first_name || '',
                lastName: shippingAddress.last_name || '',
                addressLine1: shippingAddress.line1 || '',
                addressLine2: shippingAddress.line2 || '',
                city: shippingAddress.city || '',
                state: shippingAddress.state || '',
                postalCode: shippingAddress.postal_code || '',
                country: shippingAddress.country || 'US'
              } : undefined,
              paymentIntentId: session.payment_intent as string
            });

            if (adminNotificationSent) {
              console.log(`✅ Admin notification sent for order: ${order.order_number}`);
            } else {
              console.error(`❌ Failed to send admin notification for order: ${order.order_number}`);
            }
          } catch (emailError) {
            console.error('Error sending admin notification email:', emailError);
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
