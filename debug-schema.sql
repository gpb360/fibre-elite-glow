-- Run this in your Supabase SQL Editor to see the actual orders table schema
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM
    information_schema.columns
WHERE
    table_name = 'orders'
ORDER BY
    ordinal_position;

-- Check for triggers on orders table
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM
    information_schema.triggers
WHERE
    event_object_table = 'orders';
