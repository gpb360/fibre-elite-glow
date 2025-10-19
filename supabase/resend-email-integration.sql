-- =========================================================
-- RESEND EMAIL INTEGRATION FOR FIBRE ELITE GLOW
-- =========================================================
-- This script sets up Resend email functionality using Supabase database functions
-- It uses pg_net extension to make HTTP requests to Resend API
-- Last updated: January 2025
-- =========================================================

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create email logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_message TEXT,
    resend_id VARCHAR(100),
    request_data JSONB,
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for email_logs
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_name ON email_logs(template_name);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);

-- =========================================================
-- RESEND EMAIL FUNCTIONS
-- =========================================================

-- Function to send email via Resend API
CREATE OR REPLACE FUNCTION send_email_via_resend(
    p_to_email VARCHAR(255),
    p_subject VARCHAR(500),
    p_html_content TEXT,
    p_text_content TEXT DEFAULT NULL,
    p_from_email VARCHAR(255) DEFAULT NULL,
    p_reply_to VARCHAR(255) DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_api_key TEXT;
    v_from_email VARCHAR(255);
    v_request_body JSONB;
    v_response_id INTEGER;
    v_log_id UUID;
    v_base_url TEXT := 'https://api.resend.com/emails';
BEGIN
    -- Get Resend API key from secrets
    SELECT value INTO v_api_key
    FROM secrets
    WHERE key = 'RESEND_API_KEY'
    LIMIT 1;

    IF v_api_key IS NULL THEN
        RAISE EXCEPTION 'RESEND_API_KEY not found in secrets table';
    END IF;

    -- Set default from email if not provided
    v_from_email := COALESCE(
        p_from_email,
        'noreply@' || split_part(current_setting('app.domain', true), '.', 2)
    );

    -- Create email log entry
    INSERT INTO email_logs (
        to_email,
        subject,
        status,
        request_data
    ) VALUES (
        p_to_email,
        p_subject,
        'pending',
        jsonb_build_object(
            'to', p_to_email,
            'subject', p_subject,
            'from', v_from_email,
            'replyTo', p_reply_to,
            'html', p_html_content,
            'text', p_text_content
        )
    ) RETURNING id INTO v_log_id;

    -- Prepare request body for Resend API
    v_request_body := jsonb_build_object(
        'from', v_from_email,
        'to', jsonb_build_array(p_to_email),
        'subject', p_subject,
        'html', p_html_content
    );

    -- Add text content if provided
    IF p_text_content IS NOT NULL THEN
        v_request_body := jsonb_set(v_request_body, '{text}', to_jsonb(p_text_content));
    END IF;

    -- Add reply_to if provided
    IF p_reply_to IS NOT NULL THEN
        v_request_body := jsonb_set(v_request_body, '{replyTo}', to_jsonb(p_reply_to));
    END IF;

    -- Make HTTP request to Resend API using pg_net
    PERFORM net.http_post(
        url := v_base_url,
        headers := jsonb_build_object(
            'Authorization', 'Bearer ' || v_api_key,
            'Content-Type', 'application/json'
        ),
        body := jsonb_extract_path_text(v_request_body, 'body')
    );

    -- Update log with sent status (async, will be updated by webhook)
    UPDATE email_logs
    SET status = 'sent', updated_at = NOW()
    WHERE id = v_log_id;

    RETURN v_log_id;
END;
$$;

-- Function to send order confirmation email
CREATE OR REPLACE FUNCTION send_order_confirmation_email(
    p_order_id UUID,
    p_customer_email VARCHAR(255),
    p_order_number VARCHAR(100),
    p_customer_name VARCHAR(200) DEFAULT NULL,
    p_items JSONB DEFAULT NULL,
    p_total_amount DECIMAL(10,2) DEFAULT NULL,
    p_currency VARCHAR(3) DEFAULT 'USD'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_html_content TEXT;
    v_text_content TEXT;
    v_subject VARCHAR(500);
    v_log_id UUID;
BEGIN
    -- Generate email subject
    v_subject := 'Order Confirmation - ' || p_order_number;

    -- Generate HTML email content
    v_html_content := format('
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
        .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
        .items-table { width: 100%%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
        .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #28a745; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order. We''re excited to get your La Belle Vie products to you!</p>
        </div>

        <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> %s</p>
            <p><strong>Order Date:</strong> %s</p>
            <p><strong>Status:</strong> Confirmed</p>
            <h3>Items Ordered</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th style="text-align: center;">Quantity</th>
                        <th style="text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    %s
                </tbody>
            </table>
            <p class="total">Total: %s</p>
        </div>

        <div class="order-details">
            <h2>What''s Next?</h2>
            <ol>
                <li><strong>Processing:</strong> Your order is being prepared (1-2 business days)</li>
                <li><strong>Shipping:</strong> You''ll receive tracking information once shipped</li>
                <li><strong>Delivery:</strong> Your package will arrive within 3-7 business days</li>
            </ol>
        </div>

        <div class="footer">
            <p>Questions? Contact our support team at support@fibreeliteglow.com</p>
            <p>La Belle Vie - Premium Gut Health Solutions</p>
        </div>
    </div>
</body>
</html>',
        p_order_number,
        NOW()::text,
        COALESCE(
            (SELECT string_agg(
                format('<tr><td>%s</td><td style="text-align: center;">%s</td><td style="text-align: right;">%s</td></tr>',
                    item->>'name',
                    item->>'quantity',
                    '$' || round((item->>'price')::numeric * (item->>'quantity')::integer, 2)
                ), '')
            FROM jsonb_array_elements(p_items) as item
            WHERE p_items IS NOT NULL
        ),
        '<tr><td colspan="3">No items found</td></tr>'
        ),
        '$' || COALESCE(p_total_amount, 0)
    );

    -- Generate text email content
    v_text_content := format('
Order Confirmation - %s

Thank you for your order! Here are your order details:

Order Number: %s
Order Date: %s
Status: Confirmed

Items Ordered:
%s

Total: $%s

What''s Next?
1. Processing: Your order is being prepared (1-2 business days)
2. Shipping: You''ll receive tracking information once shipped
3. Delivery: Your package will arrive within 3-7 business days

Questions? Contact our support team at support@fibreeliteglow.com

La Belle Vie - Premium Gut Health Solutions
    ',
        p_order_number,
        p_order_number,
        NOW()::text,
        COALESCE(
            (SELECT string_agg(
                format('%s x%s - $%s',
                    item->>'name',
                    item->>'quantity',
                    round((item->>'price')::numeric * (item->>'quantity')::integer, 2)
                ), E'\n')
            FROM jsonb_array_elements(p_items) as item
            WHERE p_items IS NOT NULL
        ),
        'No items found'
        ),
        COALESCE(p_total_amount, 0)
    );

    -- Send the email
    v_log_id := send_email_via_resend(
        p_to_email := p_customer_email,
        p_subject := v_subject,
        p_html_content := v_html_content,
        p_text_content := v_text_content
    );

    -- Update email log with template name
    UPDATE email_logs
    SET template_name = 'order_confirmation'
    WHERE id = v_log_id;

    RETURN v_log_id;
END;
$$;

-- Function to send admin notification email
CREATE OR REPLACE FUNCTION send_admin_notification_email(
    p_order_id UUID,
    p_order_number VARCHAR(100),
    p_customer_email VARCHAR(255),
    p_customer_name VARCHAR(200),
    p_items JSONB DEFAULT NULL,
    p_total_amount DECIMAL(10,2) DEFAULT NULL,
    p_currency VARCHAR(3) DEFAULT 'USD',
    p_shipping_address JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_admin_email VARCHAR(255);
    v_html_content TEXT;
    v_text_content TEXT;
    v_subject VARCHAR(500);
    v_log_id UUID;
BEGIN
    -- Get admin email from secrets or use default
    SELECT value INTO v_admin_email
    FROM secrets
    WHERE key = 'ADMIN_EMAIL'
    LIMIT 1;

    IF v_admin_email IS NULL THEN
        v_admin_email := 'admin@lbve.ca'; -- Default fallback
    END IF;

    -- Generate email subject
    v_subject := '🚨 New Order Alert - ' || p_order_number;

    -- Generate HTML email content
    v_html_content := format('
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
        .items-table { width: 100%%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
        .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #dc3545; }
        .action-items { background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .action-item { background: white; padding: 10px; margin: 8px 0; border-left: 4px solid #007bff; }
        .customer-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 New Order Alert</h1>
            <p>A new order has been placed and requires your attention</p>
        </div>

        <div class="alert">
            <strong>⚡ Action Required:</strong> Process order %s - Customer: %s
        </div>

        <div class="order-details">
            <h2>Order Summary</h2>
            <p><strong>Order Number:</strong> %s</p>
            <p><strong>Order Date:</strong> %s</p>

            <div class="customer-info">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> %s</p>
                <p><strong>Email:</strong> %s</p>
                %s
            </div>

            <h3>Items Ordered</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th style="text-align: center;">Quantity</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    %s
                </tbody>
            </table>

            <p class="total">Order Total: $%s</p>
        </div>

        <div class="action-items">
            <h3>📋 Action Items</h3>
            <div class="action-item">
                <strong>1. Verify Inventory:</strong> Check stock levels for all ordered items
            </div>
            <div class="action-item">
                <strong>2. Process Payment:</strong> Confirm payment has been processed successfully
            </div>
            <div class="action-item">
                <strong>3. Prepare Shipment:</strong> Package items and prepare shipping label
            </div>
            <div class="action-item">
                <strong>4. Update Customer:</strong> Send tracking information once shipped
            </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p><strong>La Belle Vie Admin Panel</strong></p>
            <p>Order processing system notification</p>
        </div>
    </div>
</body>
</html>',
        p_order_number,
        p_customer_email,
        p_order_number,
        NOW()::text,
        p_customer_name,
        p_customer_email,
        COALESCE(
            format('<p><strong>Shipping Address:</strong><br>%s %s<br>%s<br>%s, %s %s<br>%s</p>',
                COALESCE(p_shipping_address->>'firstName', ''),
                COALESCE(p_shipping_address->>'lastName', ''),
                COALESCE(p_shipping_address->>'addressLine1', ''),
                COALESCE(p_shipping_address->>'city', ''),
                COALESCE(p_shipping_address->>'state', ''),
                COALESCE(p_shipping_address->>'postalCode', ''),
                COALESCE(p_shipping_address->>'country', 'US')
            ),
            '<p>No shipping address provided</p>'
        ),
        COALESCE(
            (SELECT string_agg(
                format('<tr><td>%s</td><td style="text-align: center;">%s</td><td style="text-align: right;">$%s</td></tr>',
                    item->>'name',
                    item->>'quantity',
                    round((item->>'price')::numeric * (item->>'quantity')::integer, 2)
                ), '')
            FROM jsonb_array_elements(p_items) as item
            WHERE p_items IS NOT NULL
        ),
        '<tr><td colspan="3">No items found</td></tr>'
        ),
        COALESCE(p_total_amount, 0)
    );

    -- Generate text email content
    v_text_content := format('
NEW ORDER ALERT - %s

⚡ ACTION REQUIRED: Process new order

Order Details:
- Order Number: %s
- Order Date: %s

Customer Information:
- Name: %s
- Email: %s

Shipping Address:
%s

Items Ordered:
%s

Order Total: $%s

📋 ACTION ITEMS:
1. Verify Inventory: Check stock levels for all ordered items
2. Process Payment: Confirm payment has been processed successfully
3. Prepare Shipment: Package items and prepare shipping label
4. Update Customer: Send tracking information once shipped

La Belle Vie Admin Panel
Order processing system notification
    ',
        p_order_number,
        p_order_number,
        NOW()::text,
        p_customer_name,
        p_customer_email,
        COALESCE(
            format('%s %s\n%s\n%s, %s %s\n%s',
                COALESCE(p_shipping_address->>'firstName', ''),
                COALESCE(p_shipping_address->>'lastName', ''),
                COALESCE(p_shipping_address->>'addressLine1', ''),
                COALESCE(p_shipping_address->>'city', ''),
                COALESCE(p_shipping_address->>'state', ''),
                COALESCE(p_shipping_address->>'postalCode', ''),
                COALESCE(p_shipping_address->>'country', 'US')
            ),
            'No shipping address provided'
        ),
        COALESCE(
            (SELECT string_agg(
                format('%s x%s - $%s',
                    item->>'name',
                    item->>'quantity',
                    round((item->>'price')::numeric * (item->>'quantity')::integer, 2)
                ), E'\n')
            FROM jsonb_array_elements(p_items) as item
            WHERE p_items IS NOT NULL
        ),
        'No items found'
        ),
        COALESCE(p_total_amount, 0)
    );

    -- Send the email
    v_log_id := send_email_via_resend(
        p_to_email := v_admin_email,
        p_subject := v_subject,
        p_html_content := v_html_content,
        p_text_content := v_text_content
    );

    -- Update email log with template name
    UPDATE email_logs
    SET template_name = 'admin_notification'
    WHERE id = v_log_id;

    RETURN v_log_id;
END;
$$;

-- =========================================================
-- TRIGGER FUNCTION FOR AUTOMATIC EMAIL SENDING
-- =========================================================

-- Function to send emails when new orders are created
CREATE OR REPLACE FUNCTION send_order_emails_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_items JSONB;
    v_shipping_address JSONB;
BEGIN
    -- Convert order items to JSONB format
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.unit_price,
            'total_price', oi.total_price
        )
    ) INTO v_order_items
    FROM order_items oi
    WHERE oi.order_id = NEW.id;

    -- Build shipping address JSONB
    v_shipping_address := jsonb_build_object(
        'firstName', NEW.shipping_first_name,
        'lastName', NEW.shipping_last_name,
        'addressLine1', NEW.shipping_address_line_1,
        'addressLine2', NEW.shipping_address_line_2,
        'city', NEW.shipping_city,
        'state', NEW.shipping_state_province,
        'postalCode', NEW.shipping_postal_code,
        'country', NEW.shipping_country
    );

    -- Send order confirmation email to customer
    PERFORM send_order_confirmation_email(
        p_order_id := NEW.id,
        p_customer_email := NEW.email,
        p_order_number := NEW.order_number,
        p_customer_name := COALESCE(NEW.shipping_first_name || ' ' || NEW.shipping_last_name, 'Valued Customer'),
        p_items := v_order_items,
        p_total_amount := NEW.total_amount,
        p_currency := NEW.currency
    );

    -- Send admin notification email
    PERFORM send_admin_notification_email(
        p_order_id := NEW.id,
        p_order_number := NEW.order_number,
        p_customer_email := NEW.email,
        p_customer_name := COALESCE(NEW.shipping_first_name || ' ' || NEW.shipping_last_name, 'Unknown Customer'),
        p_items := v_order_items,
        p_total_amount := NEW.total_amount,
        p_currency := NEW.currency,
        p_shipping_address := v_shipping_address
    );

    RETURN NEW;
END;
$$;

-- Create trigger to automatically send emails when orders are created
DROP TRIGGER IF EXISTS send_order_emails_on_insert ON orders;
CREATE TRIGGER send_order_emails_on_insert
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION send_order_emails_trigger();

-- =========================================================
-- RLS POLICIES FOR EMAIL LOGS
-- =========================================================

-- Enable RLS on email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can view email logs
CREATE POLICY email_logs_admin_policy ON email_logs
    FOR ALL
    USING (
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
        OR
        auth.role() = 'service_role'
    );

-- =========================================================
-- UPDATE TRIGGER FOR EMAIL LOGS
-- =========================================================

-- Add updated_at trigger for email_logs
DROP TRIGGER IF EXISTS update_email_logs_updated_at ON email_logs;
CREATE TRIGGER update_email_logs_updated_at
    BEFORE UPDATE ON email_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- GRANT PERMISSIONS
-- =========================================================

-- Grant execute permissions for email functions
GRANT EXECUTE ON FUNCTION send_email_via_resend TO service_role;
GRANT EXECUTE ON FUNCTION send_order_confirmation_email TO service_role;
GRANT EXECUTE ON FUNCTION send_admin_notification_email TO service_role;
GRANT EXECUTE ON FUNCTION send_order_emails_trigger TO service_role;

-- Grant permissions on email_logs
GRANT ALL ON email_logs TO service_role;
GRANT SELECT ON email_logs TO authenticated; -- Admins can view if they have access

-- =========================================================
-- SETUP INSTRUCTIONS
-- =========================================================

-- To complete the setup, you need to:

-- 1. Add these secrets to your Supabase project:
--    - RESEND_API_KEY: Your Resend API key from https://resend.com/api-keys
--    - ADMIN_EMAIL: The admin email address for notifications (e.g., 'admin@lbve.ca')

-- 2. Set up verified domain in Resend:
--    - Add your domain (e.g., lbve.ca) to Resend dashboard
--    - Add DNS records as instructed by Resend
--    - Wait for domain verification

-- 3. Update the default from email in the functions above:
--    - Change the v_from_email default to your verified domain email

-- Example SQL to add secrets (run in Supabase SQL Editor):
-- INSERT INTO secrets (key, value, description) VALUES
--   ('RESEND_API_KEY', 're_your_api_key_here', 'Resend API key for sending emails'),
--   ('ADMIN_EMAIL', 'admin@lbve.ca', 'Admin email for order notifications')
-- ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

COMMIT;