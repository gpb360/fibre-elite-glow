-- Testimonials table for storing customer reviews
-- Run this migration against your Supabase database

CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    featured BOOLEAN DEFAULT false,
    order_number VARCHAR(100),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON testimonials(verified) WHERE verified = true;

-- Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read approved testimonials
CREATE POLICY "Public can read approved testimonials"
    ON testimonials FOR SELECT
    USING (status = 'approved');

-- Authenticated users can insert testimonials
CREATE POLICY "Authenticated users can insert testimonials"
    ON testimonials FOR INSERT
    WITH CHECK (true);

-- Service role can do everything (for admin API)
CREATE POLICY "Service role has full access"
    ON testimonials FOR ALL
    USING (auth.role() = 'service_role');

-- Seed with existing verified testimonials
INSERT INTO testimonials (name, email, product, rating, review, verified, status, featured) VALUES
    ('G Normandeau', 'customer1@example.com', 'Total Essential', 5,
     'I cannot believe how great Total Essential is working for me. After some bad accidents and many broken bones, I was left severely constipated much of the time while healing. I endured 6 years of Dr''s prescriptions that did not work. Imagine the relief I am finally experiencing. Thank you!!!',
     true, 'approved', true),
    ('J Lemay', 'customer2@example.com', 'Total Essential', 5,
     'I absolutely love the how total essential has changed my life. Every time I have completed the 15 days, my family usually makes a comment about how good I look and how clear my complexion is. This is just a bonus, because I started using Total Essential to rid my body of toxins in a natural, safe way. I must say, I notice a difference after the first day!',
     true, 'approved', true),
    ('S Thompson', 'customer3@example.com', 'Total Essential Plus', 5,
     'The Total Essential Plus has been a game-changer for my digestive health. The additional probiotics and superfruits make such a difference. I''ve been using it for 8 months now and feel incredible every day!',
     true, 'approved', true),
    ('J Neels', 'customer4@example.com', 'Total Essential', 5,
     'I have been using Total Essential for about 2 years now. It has been life changing for me. I have troubles with my digestive system from working shift work as a nurse. After taking Total Essential I was able to be regular, gain extra energy and feel really great about myself.',
     true, 'approved', true)
ON CONFLICT DO NOTHING;
