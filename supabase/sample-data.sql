-- Sample data for La Belle Vie E-commerce Database

-- Insert categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Fiber Supplements', 'fiber-supplements', 'Premium fiber supplements for digestive health', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Wellness Products', 'wellness-products', 'Complete wellness and health products', 2);

-- Insert main products
INSERT INTO products (id, name, slug, description, short_description, product_type, category_id, base_price, featured) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    'Total Essential',
    'total-essential',
    'PREMIUM 15-DAY DETOX & WELLNESS PROGRAM

Transform your digestive health with our scientifically formulated blend of 100% natural fruit and vegetable extracts, premium oat bran, and sustainably sourced palm tree trunk fiber. This expertly balanced combination of soluble and insoluble fiber delivers comprehensive wellness benefits including normalized bowel movements, cardiovascular support, blood sugar regulation, and effective weight management.

Certified Non-GMO and Gluten-Free, featuring nutrient-dense ingredients like organic broccoli, spinach, apple fiber, oat bran fiber, carrot, celery, papaya, and aloe vera. Perfect for health-conscious individuals seeking a convenient, once-daily wellness solution that delivers real results.',
    'Premium 15-day detox & wellness program with natural fiber blend',
    'total_essential',
    '550e8400-e29b-41d4-a716-446655440001',
    79.99,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440020',
    'Total Essential Plus',
    'total-essential-plus',
    'ADVANCED 15-DAY BEAUTY & WELLNESS PROGRAM

Elevate your health journey with our enhanced formula featuring all the powerful benefits of Total Essential PLUS four potent superfruits: Açaí Berry, Strawberry, Cranberry, and Raspberry. This premium upgrade delivers superior antioxidant protection, promotes radiant skin health, and offers a deliciously refreshing berry flavor experience.

Specially formulated for those seeking comprehensive wellness with enhanced beauty benefits, this advanced fiber blend supports clearer skin, improved complexion, and overall vitality. The added superfruit complex provides powerful anti-aging properties while maintaining all the digestive and metabolic benefits of our original formula. Certified Non-GMO and Gluten-Free with premium plant-based ingredients for visible, lasting results.',
    'Advanced 15-day beauty & wellness program with superfruits',
    'total_essential_plus',
    '550e8400-e29b-41d4-a716-446655440001',
    84.99,
    true
);

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440010', '/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png', 'Total Essential Product Image', 1, true),
('550e8400-e29b-41d4-a716-446655440020', '/lovable-uploads/5f8f72e3-397f-47a4-8bce-f15924c32a34.png', 'Total Essential Plus Product Image', 1, true);

-- Insert packages for Total Essential
INSERT INTO packages (id, product_id, product_name, product_type, quantity, price, original_price, savings, is_popular, sku, stock_quantity) VALUES
(
    'total-essential-1-box',
    '550e8400-e29b-41d4-a716-446655440010',
    'Total Essential - 1 Box',
    'total_essential',
    1,
    79.99,
    89.99,
    10.00,
    false,
    'TE-1BOX',
    100
),
(
    'total-essential-2-boxes',
    '550e8400-e29b-41d4-a716-446655440010',
    'Total Essential - 2 Boxes',
    'total_essential',
    2,
    149.99,
    179.98,
    29.99,
    true,
    'TE-2BOX',
    100
),
(
    'total-essential-4-boxes',
    '550e8400-e29b-41d4-a716-446655440010',
    'Total Essential - 4 Boxes',
    'total_essential',
    4,
    279.99,
    359.96,
    79.97,
    false,
    'TE-4BOX',
    100
);

-- Insert packages for Total Essential Plus
INSERT INTO packages (id, product_id, product_name, product_type, quantity, price, original_price, savings, is_popular, sku, stock_quantity) VALUES
(
    'total-essential-plus-1-box',
    '550e8400-e29b-41d4-a716-446655440020',
    'Total Essential Plus - 1 Box',
    'total_essential_plus',
    1,
    84.99,
    94.99,
    10.00,
    false,
    'TEP-1BOX',
    100
),
(
    'total-essential-plus-2-boxes',
    '550e8400-e29b-41d4-a716-446655440020',
    'Total Essential Plus - 2 Boxes',
    'total_essential_plus',
    2,
    159.99,
    189.98,
    29.99,
    true,
    'TEP-2BOX',
    100
),
(
    'total-essential-plus-4-boxes',
    '550e8400-e29b-41d4-a716-446655440020',
    'Total Essential Plus - 4 Boxes',
    'total_essential_plus',
    4,
    299.99,
    379.96,
    79.97,
    false,
    'TEP-4BOX',
    100
);

-- Insert some sample discount codes
INSERT INTO discount_codes (code, description, discount_type, discount_value, minimum_order_amount, usage_limit, is_active, expires_at) VALUES
('WELCOME10', '10% off for new customers', 'percentage', 10.00, 50.00, 100, true, NOW() + INTERVAL '30 days'),
('SAVE20', '$20 off orders over $100', 'fixed_amount', 20.00, 100.00, 50, true, NOW() + INTERVAL '60 days'),
('FIBER25', '25% off fiber supplements', 'percentage', 25.00, 75.00, 25, true, NOW() + INTERVAL '14 days');
