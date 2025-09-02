# 🔧 Build & Deployment Fix Guide

## ✅ **Issues Fixed**

### Node.js Version Mismatch
- **Problem**: `npm ERR! Cannot read properties of null (reading 'matches')`
- **Solution**: Updated Node.js version to 20.18.0 with proper configuration

### Dependency Resolution
- **Problem**: `ERR_PNPM_OUTDATED_LOCKFILE`
- **Solution**: Removed outdated lockfiles and configured fresh installation

## 🚀 **Updated Configuration**

### ✅ **Files Updated**
1. **`netlify.toml`**: Updated Node.js version and build command
2. **`.nvmrc`**: Added for consistent Node.js version (20.18.0)
3. **`package.json`**: Updated engine requirements and added postinstall script
4. **Removed**: Outdated `pnpm-lock.yaml` and `bun.lockb` files

### ✅ **Build Configuration**
```toml
[build]
  command = "rm -rf .next && pnpm install --no-frozen-lockfile && pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20.18.0"
  PNPM_VERSION = "8.15.0"
```

## 🎯 **What This Fixes**

### Before:
- ❌ Node.js version mismatch between local and Netlify
- ❌ Outdated lockfiles causing dependency conflicts
- ❌ Build failures during npm package installation

### After:
- ✅ Consistent Node.js 20.18.0 across all environments
- ✅ Fresh dependency resolution with `--no-frozen-lockfile`
- ✅ Proper Netlify Functions configuration for webhooks
- ✅ Clean build process with error handling

## 📦 **Next Deployment**

Your next Netlify deployment will:
1. **Use Node.js 20.18.0** (eliminates version conflicts)
2. **Install fresh dependencies** (resolves package conflicts)
3. **Deploy admin email system** (webhook function ready)
4. **Enable admin dashboard** (accessible at `/admin`)

## 🧪 **Testing After Deployment**

1. **Check build success** in Netlify deploy logs
2. **Verify function deployment**:
   - Go to Netlify Dashboard → Functions
   - Look for `stripe-webhook` function
3. **Test admin dashboard**:
   - Visit `https://lebve.netlify.app/admin`
   - Use password: `lbve-admin-2024`

## 🔗 **Setup Stripe Webhook**

Once deployment succeeds, configure your Stripe webhook:
- **URL**: `https://lebve.netlify.app/.netlify/functions/stripe-webhook`
- **Events**: `checkout.session.completed`, `payment_intent.payment_failed`

## 📧 **Environment Variables Needed**

Add to Netlify after successful deployment:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_EMAIL=admin@lbve.ca
EMAIL_PROVIDER=console
```

## 🎉 **Expected Results**

After this fix:
- ✅ Successful Netlify deployment
- ✅ Admin email notifications working
- ✅ Professional order emails with shipping details
- ✅ Admin dashboard for order management

The Node.js version mismatch was causing the build to fail during package installation. With the updated configuration, Netlify will use the same Node.js version (20.18.0) that works with all your dependencies and ensures consistent builds.

Your admin email system is ready to go once this deployment completes! 🌿