# Stripe Webhook Troubleshooting Guide

## Issue: Webhooks Not Triggering on Live Site

This document helps diagnose why Stripe webhooks work with CLI but not the live site.

## 🔍 **Diagnostic Steps**

### 1. **Test the Diagnostic Endpoint**
```
GET https://lebve.netlify.app/api/webhook-test
```
This will show:
- Environment variable status
- Webhook configuration
- Request handling capability

### 2. **Test Webhook with Stripe CLI (Working)**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Then trigger a test webhook to compare.

### 3. **Common Issues & Solutions**

#### **Issue 1: Incorrect Webhook URL in Stripe Dashboard**
**Symptoms**: CLI works, live site doesn't
**Solution**:
1. Go to Stripe Dashboard → Webhooks
2. Check webhook endpoint URL is: `https://lebve.netlify.app/api/webhooks/stripe`
3. Ensure it's set to listen to `checkout.session.completed` events

#### **Issue 2: Missing Webhook Secret**
**Symptoms**: Webhook signature verification fails
**Solution**:
1. Check environment variables in Netlify dashboard
2. Ensure `STRIPE_WEBHOOK_SECRET` is set in Netlify environment
3. Verify the secret matches what's in Stripe Dashboard

#### **Issue 3: Netlify Function Timeout**
**Symptoms**: Webhook endpoint returns 404 or timeout
**Solution**:
1. Check function logs in Netlify dashboard
2. Ensure functions are properly deployed
3. Check if Netlify caching is interfering

#### **Issue 4: CORS or Security Headers**
**Symptoms**: Request blocked by browser/security
**Solution**:
1. Check Netlify.toml headers configuration
2. Verify API routes are not blocked by CORS policies

#### **Issue 5: Environment Variable Mismatch**
**Symptoms**: Different behavior between local and production
**Solution**:
1. Verify all required environment variables in Netlify:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_BASE_URL`

## 🛠 **Testing Checklist**

### Pre-Deployment
- [ ] Webhook endpoint accessible: `GET /api/webhook-test`
- [ ] Environment variables set in Netlify
- [ ] Stripe webhook URL configured correctly
- [ ] Test events enabled in Stripe Dashboard

### Post-Deployment
- [ ] Check Netlify function logs
- [ ] Test webhook with Stripe CLI
- [ ] Monitor Stripe webhook delivery logs
- [ ] Verify database records created

## 🔧 **Manual Testing**

### Using curl to test webhook endpoint:
```bash
curl -X POST https://lebve.netlify.app/api/webhook-test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Using Stripe CLI to test live endpoint:
```bash
stripe trigger checkout.session.completed \
  --add checkout_session:metadata.test_id="manual_test_123"
```

## 📊 **Log Monitoring**

### Check these locations:
1. **Netlify Function Logs**: Dashboard → Functions → Functions logs
2. **Stripe Webhook Logs**: Dashboard → Webhooks → Your webhook → Recent deliveries
3. **Supabase Logs**: Dashboard → Database → Logs

## 🚨 **Common Error Messages**

### "Webhook signature verification failed"
- Cause: Mismatched webhook secret
- Fix: Update `STRIPE_WEBHOOK_SECRET` in Netlify

### "Method not allowed"
- Cause: Wrong HTTP method or route mismatch
- Fix: Ensure URL is correct and route exists

### "Database unavailable"
- Cause: Supabase connection issues
- Fix: Check Supabase credentials and connection

## 📞 **Support**

If issues persist:
1. Check Stripe webhook delivery logs
2. Review Netlify function logs
3. Verify environment variables
4. Test with minimal webhook payload

## 🔗 **Useful Links**

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Netlify Functions Documentation](https://docs.netlify.com/edge-functions/overview/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)