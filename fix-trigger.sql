-- Fix the trigger that's causing the error
-- Run this in your Supabase SQL Editor

-- Drop and recreate the function with the correct column name
CREATE OR REPLACE FUNCTION notify_admin_new_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Call a Supabase Edge Function
  PERFORM net.http_post(
    'https://lyynavswxtzhsmwetgtn.supabase.co/functions/v1/send-admin-notification',
    jsonb_build_object(
      'order_id', NEW.id,
      'customer_email', NEW.email,  -- Changed from NEW.customer_email to NEW.email
      'total_amount', NEW.total_amount,
      'order_number', NEW.order_number
    ),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
      'Content-Type', 'application/json'
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't fail the order insert if the notification fails
  RAISE WARNING 'Failed to send admin notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verify the trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_new_order_created';
