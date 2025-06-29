-- database-stripe-migration.sql
-- Migration script for Stripe integration
-- Adds checkout_sessions table, secrets table, and updates orders table

-- Enable necessary extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update payment_status enum to include more Stripe-specific statuses
-- We'll create a new type and migrate data to avoid conflicts
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_extended') THEN
        CREATE TYPE payment_status_extended AS ENUM (
            'pending', 'processing', 'paid', 'failed', 'refunded', 
            'requires_payment_method', 'requires_confirmation', 'requires_action'
        );
        
        -- If we need to migrate existing data, we would do it here
        -- This is commented out as it depends on existing data structure
        -- ALTER TABLE orders ALTER COLUMN payment_status TYPE payment_status_extended 
        --   USING payment_status::text::payment_status_extended;
    END IF;
END
$$;

-- Create checkout_sessions table to track Stripe checkout sessions
CREATE TABLE IF NOT EXISTS checkout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount_total DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_intent VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    status VARCHAR(50) DEFAULT 'open',
    metadata JSONB,
    failure_reason TEXT,
    user_id UUID,
    test_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create secrets table for storing sensitive configuration
CREATE TABLE IF NOT EXISTS secrets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Update orders table to include Stripe-specific fields
-- We use ALTER TABLE IF EXISTS to handle cases where the table might have been renamed
ALTER TABLE IF EXISTS orders
    ADD COLUMN IF NOT EXISTS session_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS payment_intent VARCHAR(255),
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
    ADD COLUMN IF NOT EXISTS charge_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS receipt_url TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB,
    ADD COLUMN IF NOT EXISTS test_mode BOOLEAN DEFAULT false;

-- Add proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_customer_email ON checkout_sessions(customer_email);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_payment_intent ON checkout_sessions(payment_intent);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent);

-- Create updated_at triggers for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for new tables
DROP TRIGGER IF EXISTS update_checkout_sessions_updated_at ON checkout_sessions;
CREATE TRIGGER update_checkout_sessions_updated_at 
    BEFORE UPDATE ON checkout_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_secrets_updated_at ON secrets;
CREATE TRIGGER update_secrets_updated_at 
    BEFORE UPDATE ON secrets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for security
-- Enable RLS on tables
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;

-- Create policy for checkout_sessions
-- Users can view their own checkout sessions
CREATE POLICY checkout_sessions_select_policy ON checkout_sessions
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR 
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Admin users can insert/update/delete checkout sessions
CREATE POLICY checkout_sessions_admin_policy ON checkout_sessions
    FOR ALL
    USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Server-side functions can manage checkout sessions (for webhooks)
CREATE POLICY checkout_sessions_service_policy ON checkout_sessions
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create policy for secrets - only admins and service role can access
CREATE POLICY secrets_admin_policy ON secrets
    FOR ALL
    USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
        OR
        auth.role() = 'service_role'
    );

-- Create user_roles table if it doesn't exist (needed for RLS policies)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Add trigger for user_roles
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at 
    BEFORE UPDATE ON user_roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles - only admins can manage roles
CREATE POLICY user_roles_admin_policy ON user_roles
    FOR ALL
    USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
        OR
        auth.role() = 'service_role'
    );

-- Add initial secrets for Stripe (commented out for security)
-- INSERT INTO secrets (key, value, description)
-- VALUES 
--   ('STRIPE_WEBHOOK_SECRET', 'whsec_your_webhook_secret_here', 'Stripe webhook signing secret')
-- ON CONFLICT (key) DO NOTHING;

-- Add foreign key constraint between checkout_sessions and orders
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'session_id'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_orders_checkout_session'
        ) THEN
            ALTER TABLE orders
            ADD CONSTRAINT fk_orders_checkout_session
            FOREIGN KEY (session_id)
            REFERENCES checkout_sessions(session_id)
            ON DELETE SET NULL;
        END IF;
    END IF;
END
$$;

-- Create a view for easier reporting on payments
CREATE OR REPLACE VIEW payment_reports AS
SELECT 
    o.id AS order_id,
    o.order_number,
    o.customer_id,
    o.email,
    o.total_amount,
    o.payment_status,
    o.payment_intent,
    o.session_id,
    cs.status AS checkout_status,
    cs.created_at AS checkout_created_at,
    o.created_at AS order_created_at,
    o.test_mode
FROM 
    orders o
LEFT JOIN 
    checkout_sessions cs ON o.session_id = cs.session_id;

-- Grant appropriate permissions
GRANT SELECT ON checkout_sessions TO authenticated;
GRANT SELECT ON payment_reports TO authenticated;
GRANT ALL ON secrets TO service_role;
