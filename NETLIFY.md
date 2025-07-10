# Netlify Deployment Guide

## Environment Variables Setup

To deploy this application on Netlify, you must configure the following environment variables in your Netlify site settings:

### Required Environment Variables

1. **Stripe Configuration**
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
   STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_TEST_MODE=false (set to true for testing)
   ```

2. **Supabase Configuration**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Application Configuration**
   ```
   NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
   ```

### How to Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable** for each environment variable above
4. Make sure to use the exact variable names as shown

### Common Issues and Solutions

#### "Stripe not configured correctly" Error

This error occurs when `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is missing or invalid.

**Solution:**
1. Verify the publishable key is set in Netlify environment variables
2. Ensure the key starts with `pk_test_` (for test mode) or `pk_live_` (for production)
3. Check that the key is not wrapped in quotes in the Netlify dashboard

#### Stripe Webhooks Not Working

**Solution:**
1. Set up a webhook endpoint in your Stripe dashboard pointing to: `https://your-site.netlify.app/api/webhooks/stripe`
2. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` environment variable
3. Ensure the webhook is configured to send the following events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`

#### Base URL Issues

**Solution:**
1. Set `NEXT_PUBLIC_BASE_URL` to your actual Netlify domain (e.g., `https://your-site.netlify.app`)
2. This is crucial for Stripe success/cancel URL redirects

### Build Configuration

The project includes a `netlify.toml` file with optimized build settings:
- Build command: `pnpm build`
- Publish directory: `.next`
- Next.js plugin enabled
- Security headers configured

### Testing the Deployment

After deploying:
1. Check the browser console for any Stripe-related errors
2. Test the checkout flow end-to-end
3. Verify webhook events are being received (check Stripe dashboard)
4. Ensure redirects work properly after payment

### Troubleshooting

If you're still seeing Stripe configuration errors:
1. Check the Netlify build logs for environment variable loading
2. Verify all environment variables are set correctly (no typos)
3. Check the browser developer tools Network tab for failed API calls
4. Ensure your Stripe account is properly activated