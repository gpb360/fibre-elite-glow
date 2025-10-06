# Environment Variables Setup

## Problem
After checkout, the site redirects to `https://lebve.netlify.app/checkout/success` instead of your custom domain `https://lbve.venomappdevelopment.com`.

## Solution
Set the `NEXT_PUBLIC_BASE_URL` environment variable in Netlify to your custom domain.

## Step-by-Step Instructions

### 1. Go to Netlify Dashboard

1. Visit: https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**

### 2. Add/Update Environment Variable

Add or update the following variable:

**Key**: `NEXT_PUBLIC_BASE_URL`
**Value**: `https://lbve.venomappdevelopment.com`

**Important**: Do NOT include a trailing slash!

### 3. Complete Environment Variables List

Make sure you have ALL of these set in Netlify:

```bash
# Domain Configuration
NEXT_PUBLIC_BASE_URL=https://lbve.venomappdevelopment.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...                      # Your live Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...   # Your live publishable key
STRIPE_WEBHOOK_SECRET=whsec_MUvEVlDuJrgHkAWwMAYVjvcrkovZIN0p

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...                 # For admin operations

# Email Configuration (Resend)
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@venomappdevelopment.com
```

### 4. Redeploy Your Site

After adding/updating environment variables:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

### 5. Verify the Change

Test the checkout flow:

1. Add items to cart
2. Go through checkout
3. After payment, verify the URL is:
   - ✅ `https://lbve.venomappdevelopment.com/checkout/success`
   - ❌ NOT `https://lebve.netlify.app/checkout/success`

## How It Works

The code in `app/api/create-checkout-session/route.ts` uses this priority:

```javascript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||  // 1. Your custom domain
               process.env.URL ||                     // 2. Netlify auto-generated URL
               'https://lebve.netlify.app';          // 3. Fallback (old domain)
```

When you set `NEXT_PUBLIC_BASE_URL`, it will use your custom domain for:
- ✅ Stripe checkout success redirect
- ✅ Stripe checkout cancel redirect
- ✅ Email links (if used)
- ✅ Any other generated URLs

## Where This Affects

Setting `NEXT_PUBLIC_BASE_URL` fixes URLs in:

1. **Stripe Checkout** (`create-checkout-session/route.ts:75-77`)
   - Success URL: `https://lbve.venomappdevelopment.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `https://lbve.venomappdevelopment.com/cart?cancelled=true`

2. **Stripe Dashboard Configuration**
   - Your webhook URL: `https://lbve.venomappdevelopment.com/api/webhooks/stripe`

## Troubleshooting

### Still redirecting to old domain?

1. **Check if variable is set**: Go to Netlify → Site settings → Environment variables
2. **Check variable name**: Must be exactly `NEXT_PUBLIC_BASE_URL` (case-sensitive)
3. **Check value format**:
   - ✅ `https://lbve.venomappdevelopment.com`
   - ❌ `https://lbve.venomappdevelopment.com/` (no trailing slash)
   - ❌ `lbve.venomappdevelopment.com` (include https://)
4. **Redeploy**: Environment variables only take effect after redeployment
5. **Clear cache**: Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)

### Testing Locally

For local development, add to your `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Custom Domain Setup in Netlify

If you haven't set up your custom domain yet:

1. Go to **Domain management** → **Domains**
2. Click **Add a domain**
3. Enter: `lbve.venomappdevelopment.com`
4. Follow Netlify's instructions to configure DNS
5. Wait for SSL certificate to provision (usually 1-2 hours)
6. Once active, set `NEXT_PUBLIC_BASE_URL` as shown above

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com/environment-variables/overview/
- Custom Domains: https://docs.netlify.com/domains-https/custom-domains/
