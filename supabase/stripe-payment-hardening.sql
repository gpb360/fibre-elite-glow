-- Apply to the client's isolated Supabase project before enabling Stripe webhooks.
-- This migration is idempotent and intentionally grants execution only to service_role.

BEGIN;

-- Normalize the two historical checkout schemas before adding the payment
-- invariants. The base business tables must already exist.
ALTER TABLE IF EXISTS checkout_sessions
    ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS amount_total DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'CAD',
    ADD COLUMN IF NOT EXISTS payment_intent VARCHAR(255),
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'open',
    ADD COLUMN IF NOT EXISTS metadata JSONB,
    ADD COLUMN IF NOT EXISTS failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS user_id UUID,
    ADD COLUMN IF NOT EXISTS test_mode BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS orders
    ADD COLUMN IF NOT EXISTS session_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'CAD',
    ADD COLUMN IF NOT EXISTS shipping_first_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS shipping_last_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS shipping_address_line_1 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS shipping_address_line_2 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS shipping_state_province VARCHAR(100),
    ADD COLUMN IF NOT EXISTS shipping_postal_code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100),
    ADD COLUMN IF NOT EXISTS billing_first_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS billing_last_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS billing_address_line_1 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS billing_address_line_2 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS billing_city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS billing_state_province VARCHAR(100),
    ADD COLUMN IF NOT EXISTS billing_postal_code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS billing_country VARCHAR(100);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_session_id_unique ON orders(session_id)
    WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_customer_email
    ON checkout_sessions(customer_email);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    livemode BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
    attempt_count INTEGER NOT NULL DEFAULT 1,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS stripe_webhook_effects (
    event_id TEXT NOT NULL REFERENCES stripe_webhook_events(event_id) ON DELETE CASCADE,
    effect_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (event_id, effect_type)
);

ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_effects ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION claim_stripe_webhook_event(
    p_event_id TEXT,
    p_event_type TEXT,
    p_livemode BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_claimed_event_id TEXT;
BEGIN
    INSERT INTO stripe_webhook_events (event_id, event_type, livemode, status)
    VALUES (p_event_id, p_event_type, p_livemode, 'processing')
    ON CONFLICT (event_id) DO UPDATE
       SET status = 'processing',
           event_type = EXCLUDED.event_type,
           livemode = EXCLUDED.livemode,
           attempt_count = stripe_webhook_events.attempt_count + 1,
           last_error = NULL,
           updated_at = NOW()
     WHERE stripe_webhook_events.status = 'failed'
        OR (
          stripe_webhook_events.status = 'processing'
          AND stripe_webhook_events.updated_at < NOW() - INTERVAL '10 minutes'
        )
    RETURNING event_id INTO v_claimed_event_id;

    RETURN v_claimed_event_id IS NOT NULL;
END;
$$;

CREATE OR REPLACE FUNCTION claim_stripe_webhook_effect(
    p_event_id TEXT,
    p_effect_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_claimed_event_id TEXT;
BEGIN
    INSERT INTO stripe_webhook_effects (event_id, effect_type, status)
    VALUES (p_event_id, p_effect_type, 'processing')
    ON CONFLICT (event_id, effect_type) DO NOTHING
    RETURNING event_id INTO v_claimed_event_id;

    RETURN v_claimed_event_id IS NOT NULL;
END;
$$;

CREATE OR REPLACE FUNCTION apply_paid_order_inventory(
    p_event_id TEXT,
    p_order_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_claimed BOOLEAN;
    v_expected INTEGER;
    v_updated INTEGER;
BEGIN
    v_claimed := claim_stripe_webhook_effect(p_event_id, 'inventory');
    IF NOT v_claimed THEN
        RETURN FALSE;
    END IF;

    SELECT COUNT(*)
      INTO v_expected
      FROM (
        SELECT product_name, product_type
          FROM order_items
         WHERE order_id = p_order_id
         GROUP BY product_name, product_type
      ) expected_packages;

    WITH quantities AS (
        SELECT product_name, product_type, SUM(quantity)::INTEGER AS quantity
          FROM order_items
         WHERE order_id = p_order_id
         GROUP BY product_name, product_type
    ), updated_packages AS (
        UPDATE packages AS package
           SET stock_quantity = package.stock_quantity - quantities.quantity,
               updated_at = NOW()
          FROM quantities
         WHERE package.product_name = quantities.product_name
           AND package.product_type::TEXT = quantities.product_type::TEXT
           AND COALESCE(package.stock_quantity, 0) >= quantities.quantity
        RETURNING package.id
    )
    SELECT COUNT(*) INTO v_updated FROM updated_packages;

    IF v_expected = 0 OR v_updated <> v_expected THEN
        RAISE EXCEPTION 'Inventory package mapping incomplete for order %', p_order_id;
    END IF;

    UPDATE stripe_webhook_effects
       SET status = 'completed', updated_at = NOW()
     WHERE event_id = p_event_id AND effect_type = 'inventory';

    RETURN TRUE;
END;
$$;

ALTER TABLE affiliate_sales
    ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_sales_stripe_session
    ON affiliate_sales(stripe_session_id)
    WHERE stripe_session_id IS NOT NULL;

CREATE OR REPLACE FUNCTION record_verified_affiliate_sale(
    p_affiliate_code TEXT,
    p_order_id UUID,
    p_order_number TEXT,
    p_customer_email TEXT,
    p_sale_amount NUMERIC,
    p_stripe_session_id TEXT
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_affiliate affiliates%ROWTYPE;
    v_commission NUMERIC;
    v_sale_id UUID;
BEGIN
    SELECT *
      INTO v_affiliate
      FROM affiliates
     WHERE affiliate_code = UPPER(TRIM(p_affiliate_code))
       AND is_active = TRUE
     FOR UPDATE;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    v_commission := ROUND(p_sale_amount * v_affiliate.commission_percent / 100, 2);

    INSERT INTO affiliate_sales (
        affiliate_id,
        order_id,
        order_number,
        customer_email,
        sale_amount,
        commission_amount,
        commission_percent,
        stripe_session_id,
        status
    ) VALUES (
        v_affiliate.id,
        p_order_id,
        p_order_number,
        p_customer_email,
        p_sale_amount,
        v_commission,
        v_affiliate.commission_percent,
        p_stripe_session_id,
        'pending'
    )
    ON CONFLICT (stripe_session_id) WHERE stripe_session_id IS NOT NULL DO NOTHING
    RETURNING id INTO v_sale_id;

    IF v_sale_id IS NULL THEN
        RETURN NULL;
    END IF;

    UPDATE affiliates
       SET total_sales = COALESCE(total_sales, 0) + p_sale_amount,
           total_commission = COALESCE(total_commission, 0) + v_commission,
           updated_at = NOW()
     WHERE id = v_affiliate.id;

    RETURN v_commission;
END;
$$;

-- A deliberately simple capability marker. Checkout calls this before Stripe
-- session creation, so payment cannot be enabled until this entire hardening
-- migration has been installed on the target project.
CREATE OR REPLACE FUNCTION payment_checkout_ready()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
      to_regclass('public.checkout_sessions') IS NOT NULL
      AND to_regclass('public.orders') IS NOT NULL
      AND to_regclass('public.order_items') IS NOT NULL
      AND to_regclass('public.packages') IS NOT NULL
      AND to_regclass('public.affiliates') IS NOT NULL
      AND to_regclass('public.affiliate_sales') IS NOT NULL
      AND NOT EXISTS (
        SELECT 1
          FROM (VALUES
            ('checkout_sessions', 'session_id'),
            ('checkout_sessions', 'customer_email'),
            ('checkout_sessions', 'amount_total'),
            ('checkout_sessions', 'currency'),
            ('checkout_sessions', 'payment_intent'),
            ('checkout_sessions', 'payment_status'),
            ('checkout_sessions', 'status'),
            ('checkout_sessions', 'metadata'),
            ('checkout_sessions', 'test_mode'),
            ('checkout_sessions', 'expires_at'),
            ('orders', 'session_id'),
            ('orders', 'stripe_payment_intent_id'),
            ('orders', 'tax_amount'),
            ('orders', 'shipping_amount'),
            ('orders', 'shipping_address_line_1'),
            ('orders', 'billing_address_line_1'),
            ('order_items', 'product_type'),
            ('packages', 'stock_quantity'),
            ('affiliate_sales', 'stripe_session_id')
          ) AS required(table_name, column_name)
         WHERE NOT EXISTS (
           SELECT 1
             FROM information_schema.columns actual
            WHERE actual.table_schema = 'public'
              AND actual.table_name = required.table_name
              AND actual.column_name = required.column_name
         )
      )
      AND to_regprocedure('public.claim_stripe_webhook_event(text,text,boolean)') IS NOT NULL
      AND to_regprocedure('public.apply_paid_order_inventory(text,uuid)') IS NOT NULL
      AND to_regprocedure('public.record_verified_affiliate_sale(text,uuid,text,text,numeric,text)') IS NOT NULL;
$$;

REVOKE ALL ON stripe_webhook_events FROM PUBLIC, anon, authenticated;
REVOKE ALL ON stripe_webhook_effects FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION claim_stripe_webhook_event(TEXT, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION claim_stripe_webhook_effect(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION apply_paid_order_inventory(TEXT, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION record_verified_affiliate_sale(TEXT, UUID, TEXT, TEXT, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION payment_checkout_ready() FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON stripe_webhook_events TO service_role;
GRANT SELECT, INSERT, UPDATE ON stripe_webhook_effects TO service_role;
GRANT EXECUTE ON FUNCTION claim_stripe_webhook_event(TEXT, TEXT, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION claim_stripe_webhook_effect(TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION apply_paid_order_inventory(TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION record_verified_affiliate_sale(TEXT, UUID, TEXT, TEXT, NUMERIC, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION payment_checkout_ready() TO service_role;

COMMIT;
