# Stripe Checkout Session API Fix

## Issues Fixed

### 1. Import Path Issues
- **Problem**: API route was using incorrect import paths (`@/src/lib/stripe` instead of `@/lib/stripe`)
- **Solution**: Fixed import paths to use proper TypeScript path mapping from tsconfig.json

### 2. Validation Schema Mismatch
- **Problem**: Zod validation schema expected different data structure than actual request
- **Solution**: Replaced complex Zod validation with simple runtime validation that matches actual request structure

### 3. Environment Variable Handling
- **Problem**: Missing fallback for `NEXT_PUBLIC_BASE_URL` in Netlify deployment
- **Solution**: Added fallback to Netlify's `URL` environment variable and hardcoded fallback

### 4. Stripe API Integration
- **Problem**: Helper function didn't accept custom URLs for success/cancel
- **Solution**: Called Stripe API directly with dynamic URLs based on deployment environment

## Key Changes Made

### Fixed Imports
```typescript
// Before (incorrect)
import { stripe } from '../../../src/lib/stripe';

// After (correct)
import { stripe } from '@/lib/stripe';
```

### Simplified Validation
```typescript
// Before (complex Zod schema that didn't match request)
const validation = validateInput(checkoutSessionSchema, {...});

// After (simple runtime validation)
if (!rawBody.items || !Array.isArray(rawBody.items) || rawBody.items.length === 0) {
  return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
}
```

### Dynamic URL Handling
```typescript
// Added fallback for Netlify deployment
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
               process.env.URL || 
               'https://lebve.netlify.app';

// Direct Stripe API call with dynamic URLs
const session = await stripe.checkout.sessions.create({
  // ... other params
  success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/cart`,
});
```

## Supabase Integration Preserved

The fix maintains all existing Supabase functionality:
- ✅ Checkout session storage in `checkout_sessions` table
- ✅ Customer profile creation if needed
- ✅ Order metadata tracking
- ✅ Error handling for database operations

## Environment Variables Required

For Netlify deployment, ensure these environment variables are set:

### Required
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Optional (with fallbacks)
- `NEXT_PUBLIC_BASE_URL` - Your app URL (falls back to Netlify's URL)
- `STRIPE_WEBHOOK_SECRET` - For webhook handling

## Testing the Fix

1. **Local Testing**:
   ```bash
   npm run dev
   # Test checkout flow at http://localhost:3000
   ```

2. **Production Testing**:
   - Deploy to Netlify
   - Test checkout flow at https://lebve.netlify.app
   - Check Netlify function logs for any errors

## Expected Behavior

After the fix:
1. ✅ API route loads without import errors
2. ✅ Environment variables are properly accessed
3. ✅ Stripe checkout sessions are created successfully
4. ✅ Supabase stores checkout session data
5. ✅ Users are redirected to correct success/cancel URLs
6. ✅ Works on both localhost and Netlify deployment

The API should now handle checkout requests properly and integrate with both Stripe and Supabase as intended.
