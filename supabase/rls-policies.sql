-- Row Level Security (RLS) Policies for Orders Table
-- Ensure customers can only access their own orders

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for customers to view their own orders
CREATE POLICY "Customers can view their own orders" ON orders
    FOR SELECT USING (
        auth.uid()::text = (
            SELECT user_id::text 
            FROM customer_profiles 
            WHERE customer_profiles.user_id = auth.uid()
        ) OR
        email = (
            SELECT email 
            FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    );

-- Policy for customers to update their own orders (limited fields)
CREATE POLICY "Customers can update limited fields on their own orders" ON orders
    FOR UPDATE USING (
        auth.uid()::text = (
            SELECT user_id::text 
            FROM customer_profiles 
            WHERE customer_profiles.user_id = auth.uid()
        ) OR
        email = (
            SELECT email 
            FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    )
    WITH CHECK (
        -- Only allow updating specific fields like notes
        -- Prevent updating status, amounts, etc.
        (notes IS NOT DISTINCT FROM OLD.notes) AND
        (status IS NOT DISTINCT FROM OLD.status) AND
        (total_amount IS NOT DISTINCT FROM OLD.total_amount) AND
        (payment_status IS NOT DISTINCT FROM OLD.payment_status)
    );

-- Enable RLS on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy for customers to view order items for their own orders
CREATE POLICY "Customers can view order items for their own orders" ON order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id 
            FROM orders 
            WHERE (
                auth.uid()::text = (
                    SELECT user_id::text 
                    FROM customer_profiles 
                    WHERE customer_profiles.user_id = auth.uid()
                ) OR
                email = (
                    SELECT email 
                    FROM auth.users 
                    WHERE auth.users.id = auth.uid()
                )
            )
        )
    );

-- Enable RLS on checkout_sessions table
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for customers to view their own checkout sessions
CREATE POLICY "Customers can view their own checkout sessions" ON checkout_sessions
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR
        email = (
            SELECT email 
            FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    );

-- Policy for customers to insert their own checkout sessions
CREATE POLICY "Customers can insert their own checkout sessions" ON checkout_sessions
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id::text OR
        email = (
            SELECT email 
            FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    );

-- Policy for customers to update their own checkout sessions
CREATE POLICY "Customers can update their own checkout sessions" ON checkout_sessions
    FOR UPDATE USING (
        auth.uid()::text = user_id::text OR
        email = (
            SELECT email 
            FROM auth.users 
            WHERE auth.users.id = auth.uid()
        )
    );

-- Create a function to check if a user owns an order
CREATE OR REPLACE FUNCTION user_owns_order(order_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM orders 
        WHERE id = order_uuid 
        AND (
            auth.uid()::text = (
                SELECT user_id::text 
                FROM customer_profiles 
                WHERE customer_profiles.user_id = auth.uid()
            ) OR
            email = (
                SELECT email 
                FROM auth.users 
                WHERE auth.users.id = auth.uid()
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON orders TO authenticated;
GRANT SELECT ON order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON checkout_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION user_owns_order TO authenticated;