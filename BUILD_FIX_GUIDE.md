# Vercel build and deployment guide

This repository targets Vercel with Node.js 22 and pnpm. `pnpm-lock.yaml` is the authoritative lockfile.

## Local verification

```powershell
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit --pretty false
pnpm run lint
pnpm run build
```

The production build must use matching Stripe key modes:

- `NEXT_PUBLIC_STRIPE_TEST_MODE=true` requires `pk_test_` and `sk_test_` keys.
- Live keys require `NEXT_PUBLIC_STRIPE_TEST_MODE=false` and the private `ENABLE_LIVE_CHECKOUT=true` gate.

Keep `ENABLE_LIVE_CHECKOUT=false` until the client-owned Supabase project has the approved migrations, catalog and inventory data, working webhooks, Stripe Tax validation, and an agreed fulfillment/oversell policy. The checkout API fails closed when the payment schema is missing or this live-payment gate is closed.

## Required server-side configuration

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` when email delivery is enabled

Never expose those values through `NEXT_PUBLIC_` variables or commit them to Git. Configure the corresponding public Stripe/Supabase variables in Vercel and keep testimonial submissions disabled until their database and moderation workflow are ready.

## Post-deployment smoke checks

1. Confirm the exact deployment is Ready in Vercel.
2. Open the homepage, products, ingredients, testimonials, cart, checkout, and admin login.
3. Confirm image requests return successfully with exact filename casing.
4. Confirm diagnostic routes are hidden and forged admin headers are rejected.
5. Exercise checkout only in Stripe test mode against an isolated preview database before enabling real charges.
