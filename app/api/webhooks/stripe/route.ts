// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/integrations/supabase/client'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  if (!supabaseAdmin) {
    return new Response('Supabase admin client not configured', { status: 500 })
  }

  const supabase = supabaseAdmin

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      
      // Store order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          customer_email: session.customer_email,
          customer_name: session.customer_details?.name,
          total_amount: (session.amount_total || 0) / 100,
          currency: session.currency,
          status: 'confirmed',
          metadata: session.metadata,
        })
        .select()
        .single()

      if (!orderError && order) {
        const orderNumber = `FEG-${order.id.slice(0, 6).toUpperCase()}`
        const customerName = session.customer_details?.name || 'Customer'
        const totalAmount = ((session.amount_total || 0) / 100).toFixed(2)

        // Format items for email
        const items = lineItems.data.map(item => ({
          description: item.description,
          quantity: item.quantity,
          amount: ((item.amount_total || 0) / 100).toFixed(2)
        }))

        // Send customer confirmation email via Supabase Edge Function
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'order_confirmation',
            data: {
              customerEmail: session.customer_email!,
              customerName,
              orderNumber,
              totalAmount,
              items,
              orderId: order.id,
              orderDate: new Date().toLocaleDateString()
            }
          }
        })

        // Send admin notification email via Supabase Edge Function
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'admin_notification',
            data: {
              orderNumber,
              customerName,
              customerEmail: session.customer_email!,
              totalAmount,
              items,
              stripePaymentId: session.payment_intent as string,
              orderId: order.id
            }
          }
        })
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