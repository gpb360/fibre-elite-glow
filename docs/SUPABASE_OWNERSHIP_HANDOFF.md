# Supabase ownership handoff

The current Vercel production project already has a configured Supabase connection. This repair does not create, migrate, or bill a second Supabase project.

Before the custom domain launches, decide who owns the production data service:

1. The client creates a Supabase organization and project under an account they control, with at least two client administrators.
2. Agree in writing who owns billing, backups, support, access reviews, incident response, and credential rotation.
3. Apply the repository SQL to an empty preview project in this exact order: `supabase/local-full-setup.sql`, `supabase/database-stripe-migration.sql`, then `supabase/stripe-payment-hardening.sql`. The last migration normalizes historical checkout columns and installs the `payment_checkout_ready()` preflight used by the Vercel checkout. Stop if any statement fails; do not skip forward.
4. Seed only approved catalog and placeholder content. Do not copy users, orders, customer details, or test records without explicit data-transfer approval.
5. Configure preview authentication URLs and Vercel preview variables, then run the full browser, API, payment, and security suites.
6. Schedule a production cutover with a rollback window. Rotate the Supabase URL, anonymous key, service-role key, database URL, project reference, database password, JWT secret, and access token in Vercel without placing values in Git.
7. After verification, revoke the old project credentials and remove developer accounts that no longer require access.

The migration decision is separate from the current Vercel code deployment. No database should be provisioned or migrated until the owner, billing account, data set, cutover window, and rollback owner are approved.
