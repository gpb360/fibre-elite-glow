// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@lbve.ca'

serve(async (req) => {
  try {
    const { type, data } = await req.json()
    
    // Email configuration based on type
    const emailConfig: any = {
      from: 'Fibre Elite Glow <orders@stripe.lbve.ca>',
      reply_to: 'support@lbve.ca'
    }

    switch (type) {
      case 'order_confirmation':
        // Send to customer
        emailConfig.to = data.customerEmail
        emailConfig.subject = `Order Confirmed: ${data.orderNumber}`
        emailConfig.html = generateOrderEmail(data)
        break

      case 'admin_notification':
        // Send to admin
        emailConfig.to = ADMIN_EMAIL
        emailConfig.subject = `🛒 New Order: ${data.orderNumber} - $${data.totalAmount}`
        emailConfig.html = generateAdminEmail(data)
        break

      case 'payment_failed':
        // Alert admin
        emailConfig.to = ADMIN_EMAIL
        emailConfig.subject = `⚠️ Payment Failed: ${data.orderNumber}`
        emailConfig.html = generateFailureEmail(data)
        break
    }

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailConfig),
    })

    const result = await response.json()
    
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

// Email template functions
function generateOrderEmail(data: any) {
  const itemsList = data.items?.map((item: any) =>
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.amount}</td>
    </tr>`
  ).join('') || ''

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 10px 10px;
          }
          .order-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for your purchase, ${data.customerName}!</p>
        </div>

        <div class="content">
          <div class="order-box">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Date:</strong> ${data.orderDate || new Date().toLocaleDateString()}</p>
            <p><strong>Total:</strong> $${data.totalAmount}</p>
          </div>

          <h3>Items Ordered:</h3>
          <table>
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <p>Your order has been confirmed and will be processed shortly. You'll receive a shipping notification once your order is on its way!</p>

          <div class="footer">
            <p>Questions? Contact us at <a href="mailto:support@lbve.ca">support@lbve.ca</a></p>
            <p>© ${new Date().getFullYear()} Fibre Elite Glow. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateAdminEmail(data: any) {
  const itemsList = data.items?.map((item: any) =>
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.amount}</td>
    </tr>`
  ).join('') || ''

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .alert {
            background: #10b981;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .details {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 10px 10px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
          }
        </style>
      </head>
      <body>
        <div class="alert">
          <h2>🛒 New Order Received!</h2>
          <p>Order ${data.orderNumber} has been placed successfully.</p>
        </div>

        <div class="details">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>

          <h3>Order Summary</h3>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Total Amount:</strong> $${data.totalAmount}</p>

          <h3>Items Ordered:</h3>
          <table>
            <thead>
              <tr style="background: #e5e7eb;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div style="margin-top: 20px;">
            <a href="https://dashboard.stripe.com/payments/${data.stripePaymentId}" class="button">
              View in Stripe
            </a>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateFailureEmail(data: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .alert {
            background: #ef4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .details {
            background: #fee2e2;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #ef4444;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="alert">
          <h2>⚠️ Payment Failed</h2>
          <p>A payment attempt has failed and requires attention.</p>
        </div>

        <div class="details">
          <h3>Failure Details</h3>
          <p><strong>Order:</strong> ${data.orderNumber}</p>
          <p><strong>Customer:</strong> ${data.customerEmail}</p>
          <p><strong>Amount:</strong> $${data.amount}</p>
          <p><strong>Error:</strong> ${data.error}</p>

          <div style="margin-top: 20px;">
            <a href="https://dashboard.stripe.com/payments/${data.stripePaymentId}" class="button">
              View in Stripe Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  `
}