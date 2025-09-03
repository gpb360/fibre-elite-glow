// netlify/functions/stripe-webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
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
    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webhook signature verification failed' })
      };
    }

    console.log('Stripe event received:', stripeEvent.type);

    // Handle checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      
      // Get detailed session with line items
      const detailedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['line_items', 'line_items.data.price.product', 'customer']
        }
      );

      // Send admin notification email
      await sendAdminNotification(detailedSession);
    }

    // Handle payment failures
    if (stripeEvent.type === 'payment_intent.payment_failed') {
      const paymentIntent = stripeEvent.data.object;
      await sendPaymentFailureNotification(paymentIntent);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Send admin notification for new orders
async function sendAdminNotification(session) {
  try {
    const orderData = {
      orderId: session.id,
      customerName: session.customer_details?.name || 'N/A',
      customerEmail: session.customer_details?.email || 'N/A',
      amount: (session.amount_total / 100).toFixed(2),
      currency: session.currency.toUpperCase(),
      paymentStatus: session.payment_status,
      shippingAddress: session.shipping_details?.address || null,
      items: session.line_items?.data || [],
      stripeUrl: `https://dashboard.stripe.com/payments/${session.payment_intent}`,
      timestamp: new Date().toISOString()
    };

    // Send email using your preferred service
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@lbve.ca',
      subject: `🛒 New Order: ${orderData.orderId.substring(8)} - $${orderData.amount}`,
      html: generateOrderEmailHTML(orderData),
      text: generateOrderEmailText(orderData)
    });

    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

// Send notification for payment failures
async function sendPaymentFailureNotification(paymentIntent) {
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@lbve.ca',
      subject: `⚠️ Payment Failed: ${paymentIntent.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Payment Failed</h2>
          <p><strong>Payment Intent:</strong> ${paymentIntent.id}</p>
          <p><strong>Amount:</strong> $${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}</p>
          <p><strong>Error:</strong> ${paymentIntent.last_payment_error?.message || 'Unknown error'}</p>
          <p><strong>Customer:</strong> ${paymentIntent.receipt_email || 'N/A'}</p>
          <a href="https://dashboard.stripe.com/payments/${paymentIntent.id}" 
             style="background-color: #6772e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Stripe
          </a>
        </div>
      `,
      text: `Payment Failed: ${paymentIntent.id}\nAmount: $${(paymentIntent.amount / 100).toFixed(2)}\nError: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
    });
  } catch (error) {
    console.error('Error sending payment failure notification:', error);
  }
}

// Generate HTML email template for orders
function generateOrderEmailHTML(order) {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.price.product.name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.amount_total / 100).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const shippingHTML = order.shippingAddress ? `
    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #28a745;">
      <h3 style="margin: 0 0 10px 0; color: #28a745;">📦 Shipping Address</h3>
      <p style="margin: 5px 0;">${order.shippingAddress.line1}</p>
      ${order.shippingAddress.line2 ? `<p style="margin: 5px 0;">${order.shippingAddress.line2}</p>` : ''}
      <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}</p>
      <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🛒 New Order Received!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Order ID: ${order.orderId.substring(8)}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          
          <!-- Order Summary -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Order Summary</h2>
            <p><strong>💰 Total:</strong> $${order.amount} ${order.currency}</p>
            <p><strong>💳 Payment Status:</strong> <span style="color: ${order.paymentStatus === 'paid' ? '#28a745' : '#dc3545'};">${order.paymentStatus.toUpperCase()}</span></p>
            <p><strong>📅 Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          </div>

          <!-- Customer Info -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #28a745;">👤 Customer Information</h3>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${order.customerEmail}">${order.customerEmail}</a></p>
          </div>

          ${shippingHTML}

          <!-- Order Items -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #28a745;">📋 Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${order.stripeUrl}" 
               style="background-color: #6772e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block;">
              📊 View in Stripe
            </a>
            <a href="https://lebve.netlify.app/admin" 
               style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block;">
              🏠 Admin Dashboard
            </a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This is an automated notification from your La Belle Vie Éternelle store.</p>
            <p>Need help? Contact <a href="mailto:support@lbve.ca">support@lbve.ca</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text version
function generateOrderEmailText(order) {
  const itemsText = order.items.map(item => 
    `- ${item.price.product.name} (Qty: ${item.quantity}) - $${(item.amount_total / 100).toFixed(2)}`
  ).join('\n');

  const shippingText = order.shippingAddress ? `
SHIPPING ADDRESS:
${order.shippingAddress.line1}
${order.shippingAddress.line2 ? order.shippingAddress.line2 + '\n' : ''}${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}
${order.shippingAddress.country}
` : '';

  return `
NEW ORDER RECEIVED!

Order ID: ${order.orderId.substring(8)}
Total: $${order.amount} ${order.currency}
Payment Status: ${order.paymentStatus.toUpperCase()}
Date: ${new Date(order.timestamp).toLocaleString()}

CUSTOMER:
Name: ${order.customerName}
Email: ${order.customerEmail}

${shippingText}

ORDER ITEMS:
${itemsText}

View in Stripe: ${order.stripeUrl}
Admin Dashboard: https://lebve.netlify.app/admin
  `;
}

// Email sending function with Resend support
async function sendEmail({ to, subject, html, text }) {
  const emailProvider = process.env.EMAIL_PROVIDER || 'console';

  if (emailProvider === 'console') {
    // For testing - output to console
    console.log('=== EMAIL NOTIFICATION ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    console.log('========================');
    return;
  }

  if (emailProvider === 'resend') {
    // Resend email provider
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@lbve.ca',
        to: [to],
        subject: subject,
        text: text,
        html: html
      });

      console.log('Email sent successfully via Resend:', result);
      return result;
    } catch (error) {
      console.error('Resend error:', error);
      // Fallback to console if Resend fails
      console.log('=== EMAIL FALLBACK ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);
      console.log('===================');
    }
  }

  if (emailProvider === 'sendgrid') {
    // Keep SendGrid support for backwards compatibility
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      await sgMail.send({
        to,
        from: process.env.FROM_EMAIL || 'noreply@lbve.ca',
        subject,
        text,
        html
      });

      console.log('Email sent successfully via SendGrid');
    } catch (error) {
      console.error('SendGrid error:', error);
      // Fallback to console if SendGrid fails
      console.log('=== EMAIL FALLBACK ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);
      console.log('===================');
    }
  }

  // Add other email providers as needed (SMTP, etc.)
}