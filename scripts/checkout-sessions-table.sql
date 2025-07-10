-- Missing checkout_sessions table for Stripe integration
-- Run this SQL in your Supabase SQL Editor

-- Create the checkout_sessions table
CREATE TABLE IF NOT EXISTS checkout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255),
    amount_total DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_intent VARCHAR(255),
    metadata JSONB,
    status VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    test_mode BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    user_id UUID, -- References auth.users(id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_customer_email ON checkout_sessions(customer_email);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_created_at ON checkout_sessions(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_checkout_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_checkout_sessions_updated_at ON checkout_sessions;
CREATE TRIGGER update_checkout_sessions_updated_at 
    BEFORE UPDATE ON checkout_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_checkout_sessions_updated_at();

-- Add session_id column to orders table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='session_id') THEN
        ALTER TABLE orders ADD COLUMN session_id VARCHAR(255);
        CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
    END IF;
END $$;

-- Enable RLS (Row Level Security) for checkout_sessions
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for checkout_sessions
-- Policy for service role (full access)
CREATE POLICY "Service role can manage checkout sessions" ON checkout_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated users (can only see their own sessions)
CREATE POLICY "Users can see their own checkout sessions" ON checkout_sessions
    FOR SELECT USING (auth.uid() = user_id OR customer_email = auth.email());

-- Verify table creation
SELECT 'checkout_sessions table created successfully' as result;