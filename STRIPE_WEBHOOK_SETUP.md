# Stripe Webhook Setup for Production

## Problem
Resend emails are sent when testing with Stripe CLI (`stripe trigger checkout.session.completed`) but NOT when customers complete real checkouts on the website.

## Root Cause
The Stripe CLI only forwards webhooks to your local development server. For production orders, you need to configure a webhook endpoint in your **Stripe Dashboard**.

## Solution: Configure Production Webhook

### Step 1: Get Your Production Webhook URL

Your webhook endpoint is:
```
https://YOUR-DOMAIN.com/api/webhooks/stripe
```

Replace `YOUR-DOMAIN.com` with your actual deployed domain (e.g., `lebve.netlify.app` or your custom domain).

### Step 2: Add Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard**
   - Visit: https://dashboard.stripe.com/webhooks
   - Make sure you're in **Live mode** (toggle in top right)

2. **Add Endpoint**
   - Click **"+ Add endpoint"**
   - Enter your webhook URL: `https://YOUR-DOMAIN.com/api/webhooks/stripe`

3. **Select Events to Listen For**
   - Click **"Select events"**
   - Add these events:
     - `checkout.session.completed` ✅ (main event for sending emails)
     - `payment_intent.payment_failed` (optional - for failed payment alerts)

4. **Create Endpoint**
   - Click **"Add endpoint"**

### Step 3: Get Your Webhook Signing Secret

1. After creating the endpoint, click on it
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_...`)

### Step 4: Add Secret to Your Environment

Add the webhook secret to your production environment variables:

**For Netlify:**
1. Go to Netlify Dashboard → Site settings → Environment variables
2. Add new variable:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (paste your signing secret)
3. Click **"Save"**
4. **Redeploy** your site for changes to take effect

**For Vercel:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...`
3. Redeploy

**For other platforms:**
Add `STRIPE_WEBHOOK_SECRET=whsec_...` to your production environment variables.

### Step 5: Test the Webhook

1. **Send a Test Event from Stripe Dashboard**
   - In the webhook endpoint details, click **"Send test webhook"**
   - Select `checkout.session.completed`
   - Click **"Send test event"**

2. **Check the Response**
   - You should see a `200 OK` response
   - Check your logs for:
     - `✅ Webhook event received: checkout.session.completed`
     - `💾 Saving checkout session to database...`
     - `💾 Saving order to database...`
     - `📧 Sending customer confirmation email to: ...`

3. **Make a Real Test Purchase**
   - Go to your website
   - Add items to cart
   - Complete checkout with a test card: `4242 4242 4242 4242`
   - After payment, you should receive:
     - Customer confirmation email
     - Admin notification email

## Troubleshooting

### Webhook Returns 401 or 403
- Your `STRIPE_WEBHOOK_SECRET` might be incorrect
- Make sure you copied the **production** webhook secret (not test mode)
- Verify the secret is set in your hosting platform's environment variables

### Webhook Returns 500 Error
- Check your server logs for detailed error messages
- Common issues:
  - Database connection problems
  - Missing environment variables (`RESEND_API_KEY`, `ADMIN_EMAIL`)
  - Trigger function errors

### Emails Not Sending
1. **Check Resend API Key**: Make sure `RESEND_API_KEY` is set in production
2. **Verify Email Domain**: Ensure your domain is verified in Resend Dashboard
3. **Check Logs**: Look for email send errors in your server logs

### Test Mode vs Live Mode
- Make sure your webhook is configured in **Live mode** in Stripe Dashboard
- Your `STRIPE_SECRET_KEY` should start with `sk_live_...` (not `sk_test_...`)
- Your `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` should start with `pk_live_...`

## Current Webhook Events

The webhook at `/api/webhooks/stripe` handles:

1. **`checkout.session.completed`**
   - Saves checkout session to database
   - Creates order record
   - Sends customer confirmation email
   - Sends admin notification email
   - Includes order details and shipping address

2. **`payment_intent.payment_failed`**
   - Sends admin alert via Supabase Edge Function

## Email Configuration

Make sure these environment variables are set in production:

```bash
RESEND_API_KEY=re_...              # Your Resend API key
ADMIN_EMAIL=admin@venomappdevelopment.com  # Admin notification email
STRIPE_WEBHOOK_SECRET=whsec_...    # Webhook signing secret
```

## Webhook URL Reference

- **Production**: `https://YOUR-DOMAIN.com/api/webhooks/stripe`
- **Local Testing**: Use `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

---

**Need Help?**
- Stripe Webhook Docs: https://stripe.com/docs/webhooks
- Resend Docs: https://resend.com/docs
