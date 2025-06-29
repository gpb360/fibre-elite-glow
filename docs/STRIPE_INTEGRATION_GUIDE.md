# Stripe Integration Guide

_Last updated: June 28 2025_

## 1. Overview

This guide explains how the new, **end-to-end Stripe Checkout integration** was added to the Fibre Elite Glow (Next.js / Supabase) code-base and how to configure it for local development, staging and production.

Key features implemented:

* **Client flow** – `/checkout` page now collects customer / shipping details and redirects to a secure Stripe-hosted Checkout session.
* **Serverless API** – `app/api/create-checkout-session/route.ts` creates the Stripe checkout session and stores metadata (cart items, address, etc.) in Supabase.
* **Webhooks** – `app/api/webhooks/stripe/route.ts` receives Stripe events and converts successful sessions into **orders**, updates payment status or flags failures.
* **Database support** – New tables (`checkout_sessions`, `secrets`, etc.) plus RLS policies were added in `database-stripe-migration.sql`.
* **Secrets management** – All sensitive keys (secret key & webhook secret) are now pulled from **Supabase Secrets**, never from code or `.env` in production.
* **Utilities & scripts** – `scripts/setup-supabase-secrets.js` helps migrate secrets interactively; Playwright flows exercise positive/negative checkout paths.

Follow the steps below to get the integration running on your machine and in production.

---

## 2. Prerequisites & Requirements

| Tool / Service            | Minimum Version | Notes                                   |
|---------------------------|-----------------|-----------------------------------------|
| Node.js                   | 18 LTS          | Required by Next.js & Stripe SDK        |
| pnpm                      | 8.x             | `npm i -g pnpm`                         |
| Supabase CLI (optional)   | 1.171.3         | For local DB migrations `supabase db …` |
| Stripe account            | Any             | Create at <https://dashboard.stripe.com>|
| Stripe CLI (recommended)  | 1.16+           | For webhook testing                     |

Your Supabase project must be created and have the **service-role key** available (Settings → API).

---

## 3. Environment Variable Setup

Create `.env.local` (not committed):

```
# ─── Stripe ──────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…
NEXT_PUBLIC_STRIPE_TEST_MODE=true     # remove or set false in prod

# ─── Supabase ────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important**

* Only the vars prefixed with `NEXT_PUBLIC_` are ever exposed to the browser.
* Production deployments **must not** rely on `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in the host-provided env; they are fetched from Supabase Secrets (see §5).

---

## 4. Database Setup Instructions

1. Run the existing schema plus the Stripe migration:

   ```bash
   pnpm supabase db push database-schema.sql            # first-time
   pnpm supabase db push database-stripe-migration.sql  # Stripe tables
   ```

2. Verify new tables:

   ```
   checkout_sessions
   secrets
   user_roles
   ```

3. Confirm RLS is enabled:

   ```sql
   SELECT relname, relrowsecurity
   FROM pg_class
   WHERE relname IN ('checkout_sessions','secrets');
   ```

---

## 5. Supabase Secrets Configuration

Store secrets securely via:

### a) One-liner (CLI)

```bash
supabase secrets set STRIPE_SECRET_KEY="sk_live_…" STRIPE_WEBHOOK_SECRET="whsec_…"
```

### b) Interactive script

```bash
pnpm ts-node scripts/setup-supabase-secrets.js
```

The script will:

* Ensure the `secrets` table exists.
* Prompt for missing keys and validate prefixes (`sk_`, `whsec_`).
* Upsert them and show next steps.

Secrets are automatically injected into the Lambda / Edge runtime environment when deployed with Supabase deploy or Vercel *if the Supabase build plugin is used*.

---

## 6. Webhook Setup & Testing

1. In the Stripe Dashboard → Developers → **Webhooks** click **“Add endpoint”**:
   * URL: `https://<your-domain>/api/webhooks/stripe`
   * Events to send:
     * `checkout.session.completed`
     * `checkout.session.expired`
     * `payment_intent.payment_failed`

2. Copy the **Signing secret** (`whsec_…`) and add it to Supabase Secrets (see §5).

3. **Local testing** with Stripe CLI:

   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Trigger a test checkout (`pnpm dev`, go through `/checkout`, use Stripe test card `4242 4242 4242 4242`).

---

## 7. Testing the Integration

### Automated

* Run existing Playwright suites:

  ```bash
  pnpm test                         # headless
  pnpm test:headed                  # visual
  ```

  `tests/e2e/checkout-positive.spec.ts` should pass.

### Manual Checklist

| Step                                           | Expected result                      |
|------------------------------------------------|--------------------------------------|
| Add items to cart                              | Cart total updates                   |
| Submit checkout form (test keys)               | Redirects to Stripe Checkout         |
| Complete payment with `4242` card              | Redirects to `/checkout/success`     |
| Database `orders` row created                  | `status = confirmed`, items listed   |
| Payment fails (use `4000 0000 0000 0341`)      | Redirects to `/checkout/error` page  |
| Webhook logs show “received: true”             | no 400 errors                        |

---

## 8. Troubleshooting Common Issues

| Symptom / Error                              | Fix                                                                                  |
|----------------------------------------------|--------------------------------------------------------------------------------------|
| “Stripe secret key not found” in logs        | Ensure `STRIPE_SECRET_KEY` exists in Supabase Secrets or `.env.local`.               |
| `signature verification failed` on webhook   | Wrong `STRIPE_WEBHOOK_SECRET` or using the test secret in live mode.                 |
| Redirect loop back to cart                   | Cart emptied (session lost) before hitting `/checkout`; check client storage policy. |
| Checkout API 500 “line_items invalid”        | Ensure price amounts are integers (in **cents**) via `formatAmountForStripe()`.      |
| Orders not written to DB                     | `SUPABASE_SERVICE_ROLE_KEY` missing; webhook cannot bypass RLS.                      |

---

## 9. Production Deployment Checklist

1. **Branch** – merge `droid/stripe-checkout-integration` into `main`.
2. **Secrets** – confirm `STRIPE_SECRET_KEY` & `WEBHOOK_SECRET` set in Supabase.
3. **ENV** – remove `NEXT_PUBLIC_STRIPE_TEST_MODE` or set to `false`.
4. **Webhook endpoint** – ensure Stripe dashboard points to prod domain.
5. **Database** – run migrations in prod Supabase.
6. **CSP / CORS** – allow `https://checkout.stripe.com` & `https://*.stripe.com`.
7. **Monitoring** – enable Stripe email alerts & Supabase log drains.
8. **Backup** – snapshot database before first live transaction.

---

## 10. Security Considerations

* **Never** expose the secret key; client uses only the publishable key.
* Webhooks are verified with `stripe.webhooks.constructEvent` + signing secret.
* Service-role key is used **only** server-side via `supabaseAdmin` and is never bundled to the browser.
* RLS policies restrict `checkout_sessions` visibility to the session owner or admins.
* All secrets are version-controlled **outside** git via Supabase Secrets.
* If you rotate Stripe keys, **update Supabase Secrets and redeploy** – no code change required.

---

Happy building & stay secure!  
— _Fibre Elite Glow Engineering_
