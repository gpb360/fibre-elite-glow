# Supabase MCP Setup Guide
_Last updated: June&nbsp;28&nbsp;2025_

This guide walks you through wiring **Supabase** into the Model-Context-Protocol (MCP) layer used by the La Belle Vie code-base.

---

## 1. Prerequisites

| Tool | Purpose | Minimum version |
|------|---------|-----------------|
| Node.js | run scripts | 18 LTS |
| pnpm | package manager | 8.x |
| Supabase CLI | local DB / migrations | 1.171+ |
| Supabase project | where data lives | – |

---

## 2. Gather Supabase Credentials

1. Sign in to <https://app.supabase.io> and open your project.  
2. Navigate to **Settings → API**.  
3. Copy the following values:

   | Key | Notes |
   |-----|-------|
   | Project URL | looks like `https://xxx.supabase.co` |
   | anon `public` key | safe for browser usage |
   | **service_role** key | _do **NOT** expose to the client_ |

---

## 3. Update Environment Variables

Create (or edit) **`.env.local`** at the repo root:

```
# ─── Supabase ──────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...     # server-side only

# Optional – base URL for callbacks
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> ✅ **Tip:** _Never commit the `service_role` key; `.env.local` is already in `.gitignore`._

---

## 4. Store Secrets in Supabase (Production)

In production we keep secrets in **Supabase Secrets** so they are injected automatically:

```bash
supabase secrets set \
  STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
  STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET" \
  SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
```

---

## 5. Add the Supabase MCP Server

Open **`.roo/mcp.json`** and ensure the **supabase** entry exists:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp"],
      "env": {
        "SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${NEXT_PUBLIC_SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

Install the driver:

```bash
pnpm add -D @supabase/mcp
```

---

## 6. Run Database Migrations

1. Install Supabase CLI (skip if already installed):

   ```bash
   npm i -g supabase
   ```

2. Apply schemas:

   ```bash
   # base e-commerce schema
   supabase db push supabase/database-schema.sql
   # tables used by Stripe & secrets
   supabase db push supabase/database-stripe-migration.sql
   ```

---

## 7. Verify & Test

### 7.1 Automated script

```bash
pnpm ts-node scripts/setup-supabase-mcp.js
```

The script checks:
* env vars present
* Supabase connection (anon & service role)
* required tables exist
* MCP configuration validity
* basic CRUD round-trip

Fix any ❌ / ⚠️ shown, then re-run until all ✅.

### 7.2 Manual smoke test (optional)

```ts
import { supabaseAdmin } from "@/integrations/supabase/client";

const { data, error } = await supabaseAdmin.from("secrets").select("*").limit(1);
console.log(data, error);
```

If `data` appears without `error`, connection is good.

---

## 8. Running MCP Locally

```bash
pnpm factory dev      # Factory will launch all MCP servers
```

You should see a log line similar to:

```
[mcp:supabase] Connected to https://xxx.supabase.co
```

---

## 9. Common Issues

| Symptom | Fix |
|---------|-----|
| `Missing Supabase environment variables` | Add keys to `.env.local` |
| `RLS: not allowed` during script | Ensure service role key is used for admin calls |
| Tables missing | Re-run migrations (step 6) |
| MCP fails to start | Check `.roo/mcp.json` syntax & reinstall `@supabase/mcp` |

---

## 10. Next Steps

* Implement additional RLS policies if needed.  
* Use **`supabaseAdmin`** only in server code (API routes, webhooks).  
* Keep the `service_role` key out of client bundles at all times.

Happy coding 🎉
