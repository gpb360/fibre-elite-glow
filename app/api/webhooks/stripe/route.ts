// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/integrations/supabase/client'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('❌ No Stripe signature found in headers')
    return new Response('No Stripe signature found', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Webhook signature verification failed:', errorMessage)
    console.error('Body length:', body.length)
    console.error('Signature:', signature.substring(0, 20) + '...')
    console.error('Webhook secret set:', !!process.env.STRIPE_WEBHOOK_SECRET)
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  console.log('✅ Webhook event received:', event.type)

  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not configured')
    return new Response('Supabase admin client not configured', { status: 500 })
  }

  const supabase = supabaseAdmin

  switch (event.type) {
    case 'checkout.session.completed': {
      try {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('💳 Processing checkout session:', session.id)

        // Get line items (may fail for test events from stripe trigger)
        let lineItems
        try {
          lineItems = await stripe.checkout.sessions.listLineItems(session.id)
          console.log('📦 Line items retrieved:', lineItems.data.length)
        } catch (err) {
          console.warn('⚠️ Could not fetch line items (test event?):', (err as Error).message)
          // Use empty line items for test events
          lineItems = { data: [] }
        }

        // First, store checkout session in database
        console.log('💾 Saving checkout session to database...')
        const { error: sessionError } = await supabase
          .from('checkout_sessions')
          .upsert({
            session_id: session.id,
            customer_email: session.customer_email || 'no-email@test.com',
            amount_total: (session.amount_total || 0) / 100,
            currency: (session.currency || 'usd').toUpperCase(),
            payment_intent: session.payment_intent as string,
            payment_status: 'paid',
            status: 'complete',
            test_mode: session.livemode === false,
          }, { onConflict: 'session_id' })

        if (sessionError) {
          console.warn('⚠️ Could not save checkout session:', sessionError)
        }

        // Store order in database
        console.log('💾 Saving order to database...')
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            email: session.customer_email || 'no-email@test.com',
            status: 'processing',
            payment_status: 'paid',
            subtotal: (session.amount_subtotal || session.amount_total || 0) / 100,
            total_amount: (session.amount_total || 0) / 100,
          })
          .select()
          .single()

        if (orderError) {
          console.error('❌ Database error:', orderError)
          throw new Error(`Database error: ${orderError.message}`)
        }

        if (order) {
          console.log('✅ Order saved:', order.id)
          const customerName = session.customer_details?.name || 'Customer'
        const totalAmount = ((session.amount_total || 0) / 100).toFixed(2)

        // Format shipping address
        const shippingAddress = session.customer_details?.address
        const shippingAddressHtml = shippingAddress ? `
          <div class="order-box">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>${shippingAddress.line1 || ''}</p>
            ${shippingAddress.line2 ? `<p>${shippingAddress.line2}</p>` : ''}
            <p>${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postal_code || ''}</p>
            <p>${shippingAddress.country || ''}</p>
          </div>
        ` : ''

        // Format items for email
        const items = lineItems.data.length > 0
          ? lineItems.data.map(item => ({
              description: item.description,
              quantity: item.quantity,
              amount: ((item.amount_total || 0) / 100).toFixed(2)
            }))
          : [{
              description: 'Test Order Item',
              quantity: 1,
              amount: totalAmount
            }]

        // Send customer confirmation email via Resend directly
        console.log('📧 Sending customer confirmation email to:', session.customer_email)

        const itemsList = items.map((item: any) =>
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.amount}</td>
          </tr>`
        ).join('')

        // Send customer email
        const customerEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Fibre Elite Glow <orders@stripe.venomappdevelopment.com>',
            to: session.customer_email!,
            subject: `Order Confirmed: ${orderNumber}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
                    .header { background: linear-gradient(135deg, #9ED458 0%, #7FB835 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
                    .order-box { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                  </style>
                </head>
                <body>
                  <div class="header"><h1>🎉 Order Confirmed!</h1><p>Thank you for your purchase, ${customerName}!</p></div>
                  <div class="content">
                    <div class="order-box">
                      <h3 style="margin-top: 0;">Order Details</h3>
                      <p><strong>Order Number:</strong> ${orderNumber}</p>
                      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                      <p><strong>Total:</strong> $${totalAmount}</p>
                    </div>
                    ${shippingAddressHtml}
                    <h3>Items Ordered:</h3>
                    <table>
                      <thead><tr style="background: #f3f4f6;"><th style="padding: 10px; text-align: left;">Item</th><th style="padding: 10px; text-align: center;">Qty</th><th style="padding: 10px; text-align: right;">Price</th></tr></thead>
                      <tbody>${itemsList}</tbody>
                    </table>
                    <p>Your order has been confirmed and will be processed shortly. You'll receive a shipping notification once your order is on its way!</p>
                    <div class="footer"><p>Questions? Contact us at <a href="mailto:support@lbve.ca">support@lbve.ca</a></p><p>© ${new Date().getFullYear()} Fibre Elite Glow. All rights reserved.</p></div>
                  </div>
                </body>
              </html>
            `,
          }),
        })
        const customerResult = await customerEmailResponse.json()
        console.log('Customer email result:', customerResult)

        // Send admin email
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Fibre Elite Glow <orders@stripe.venomappdevelopment.com>',
            to: process.env.ADMIN_EMAIL || 'admin@venomappdevelopment.com',
            subject: `🛒 New Order: ${orderNumber} - $${totalAmount}`,
            html: `
              <!DOCTYPE html>
              <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: #9ED458; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2>🛒 New Order Received!</h2>
                    <p>Order ${orderNumber} has been placed successfully.</p>
                  </div>
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${customerName}</p>
                    <p><strong>Email:</strong> ${session.customer_email}</p>
                    ${shippingAddress ? `
                    <h3>Shipping Address</h3>
                    <p>${shippingAddress.line1 || ''}<br>
                    ${shippingAddress.line2 ? shippingAddress.line2 + '<br>' : ''}
                    ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postal_code || ''}<br>
                    ${shippingAddress.country || ''}</p>
                    ` : ''}
                    <h3>Order Summary</h3>
                    <p><strong>Order Number:</strong> ${orderNumber}</p>
                    <p><strong>Total Amount:</strong> $${totalAmount}</p>
                    <h3>Items Ordered:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background: white;">
                      <thead><tr style="background: #e5e7eb;"><th style="padding: 10px; text-align: left;">Item</th><th style="padding: 10px; text-align: center;">Qty</th><th style="padding: 10px; text-align: right;">Price</th></tr></thead>
                      <tbody>${itemsList}</tbody>
                    </table>
                    <div style="margin-top: 20px;">
                      <a href="https://dashboard.stripe.com/payments/${session.payment_intent}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">View in Stripe</a>
                    </div>
                  </div>
                </body>
              </html>
            `,
          }),
        })
        const adminResult = await adminEmailResponse.json()
        console.log('Admin email result:', adminResult)
        }
      } catch (err) {
        console.error('❌ Error processing checkout.session.completed:', err)
        return new Response(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 500 })
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Send admin alert via Supabase Edge Function
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'payment_failed',
          data: {
            orderNumber: paymentIntent.metadata.order_number || 'Unknown Order',
            customerEmail: paymentIntent.receipt_email || 'Unknown',
            amount: (paymentIntent.amount / 100).toFixed(2),
            error: paymentIntent.last_payment_error?.message || 'Payment failed',
            stripePaymentId: paymentIntent.id
          }
        }
      })
      break
    }
  }

  return new Response('Webhook processed', { status: 200 })
}