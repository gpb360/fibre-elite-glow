# Environment Setup Guide

This guide will help you set up the necessary environment variables for the La Belle Vie application.

## Required Environment Variables

### Stripe Configuration
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_` for testing)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_test_` for testing)  
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret (starts with `whsec_`)

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Application Configuration
- `NEXT_PUBLIC_BASE_URL` - Base URL for your application (e.g., `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL` - App URL (usually same as base URL)
- `NODE_ENV` - Environment mode (`development` or `production`)
- `STRIPE_TEST_MODE` - Set to `true` for testing

## Setup Instructions

### 1. Copy Environment Template
```bash
cp .env.local.example .env.local
```

### 2. Configure Stripe Keys
1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** and **Secret key**
3. Set up a webhook endpoint:
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `http://localhost:3000/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
   - Copy the webhook secret

### 3. Configure Supabase
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **Project Settings > API**
3. Copy your **URL** and **anon public** key
4. Copy your **service_role** key (keep this secure!)

### 4. Update .env.local
Replace the placeholder values in `.env.local` with your actual keys.

### 5. Validate Configuration
Run the validation script to ensure everything is configured correctly:

```bash
npm run validate:env
```

This will:
- ✅ Check all required environment variables are present
- ✅ Validate format of keys
- ✅ Test Stripe connection
- ✅ Test Supabase connection

## Common Issues

### Stripe Connection Fails
- Ensure you're using the correct test/live keys
- Check that your Stripe account is active
- Verify the secret key starts with `sk_test_` for testing

### Supabase Connection Fails
- Ensure your Supabase project is active
- Check that the service role key is correct
- Verify the URL format is correct

### Webhook Secret Issues
- Ensure you've created a webhook endpoint in Stripe
- Check that the webhook secret starts with `whsec_`
- Verify the webhook URL matches your application URL

## Testing Environment

For testing, ensure you're using:
- Stripe test keys (not live keys)
- `STRIPE_TEST_MODE=true`
- `NODE_ENV=development`

## Production Deployment

For production:
1. Use live Stripe keys
2. Set `STRIPE_TEST_MODE=false`
3. Set `NODE_ENV=production`
4. Update `NEXT_PUBLIC_BASE_URL` to your production URL
5. Configure production webhook endpoints

## Security Notes

- Never commit `.env.local` to version control
- Keep service role keys secure
- Use environment variables in production (not `.env` files)
- Regularly rotate your API keys