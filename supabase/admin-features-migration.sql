-- =========================================================
-- ADMIN FEATURES MIGRATION
-- Testimonials + Affiliates tables
-- Run in Supabase SQL Editor
-- =========================================================

BEGIN;

-- =========================================================
-- TESTIMONIALS TABLE
-- Stores customer-submitted reviews pending admin moderation
-- =========================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    stripe_order_id VARCHAR(255),
    order_number VARCHAR(255),
    admin_notes TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email);
CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON testimonials(verified);

-- =========================================================
-- AFFILIATES TABLE
-- Stores affiliate partners and their codes
-- =========================================================
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    commission_percent DECIMAL(5,2) NOT NULL DEFAULT 10.00 CHECK (commission_percent >= 0 AND commission_percent <= 100),
    is_active BOOLEAN DEFAULT true,
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for code lookups
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email);
CREATE INDEX IF NOT EXISTS idx_affiliates_active ON affiliates(is_active);

-- =========================================================
-- AFFILIATE SALES TABLE
-- Tracks individual sales attributed to affiliates
-- =========================================================
CREATE TABLE IF NOT EXISTS affiliate_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    order_number VARCHAR(255),
    customer_email VARCHAR(255),
    sale_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_percent DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for affiliate sales lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_sales_affiliate ON affiliate_sales(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_sales_order ON affiliate_sales(order_id);

-- =========================================================
-- RLS POLICIES
-- =========================================================

-- Testimonials: public read for approved, admin write
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can read approved testimonials"
    ON testimonials FOR SELECT
    USING (status = 'approved');

CREATE POLICY IF NOT EXISTS "Service role full access testimonials"
    ON testimonials FOR ALL
    USING (auth.role() = 'service_role');

-- Affiliates: admin only
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access affiliates"
    ON affiliates FOR ALL
    USING (auth.role() = 'service_role');

-- Affiliate sales: admin only
ALTER TABLE affiliate_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access affiliate_sales"
    ON affiliate_sales FOR ALL
    USING (auth.role() = 'service_role');

-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliates_updated_at ON affiliates;
CREATE TRIGGER update_affiliates_updated_at
    BEFORE UPDATE ON affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
