# Database Setup Guide

This guide will help you set up the required database tables for the Fibre Elite Glow application.

## Prerequisites
- Supabase project created and configured
- Environment variables set up (see ENVIRONMENT_SETUP.md)

## Verification Commands

### Check Environment
```bash
npm run validate:env
```

### Verify Database Schema
```bash
npm run verify:db
```

## Manual Database Setup

If the automated migration doesn't work, follow these manual steps:

### 1. Access Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **SQL Editor** in the sidebar

### 2. Run the Complete Schema
Option A: Run the complete database setup
```sql
-- Copy and paste the contents of supabase/complete-database-setup.sql
-- This will create all tables, indexes, and functions
```

Option B: Create just the missing checkout_sessions table
```sql
-- Copy and paste the contents of scripts/checkout-sessions-table.sql
-- This creates only the missing table needed for Stripe integration
```

### 3. Verify Setup
After running the SQL, verify the setup:
```bash
npm run verify:db
```

You should see all tables marked as ✅ Exists.

## Database Schema Overview

### Core Tables
- **products** - Product catalog
- **packages** - Product variants and pricing
- **categories** - Product categories
- **customers** - Customer information
- **orders** - Order records
- **order_items** - Individual order line items
- **checkout_sessions** - Stripe checkout session tracking

### Key Relationships
- `packages` → `products` (many-to-one)
- `orders` → `customers` (many-to-one)
- `order_items` → `orders` (many-to-one)
- `order_items` → `packages` (many-to-one)
- `checkout_sessions` → `orders` (one-to-one via session_id)

## Common Issues

### "Table does not exist" errors
- Ensure you've run the complete database schema
- Check that RLS (Row Level Security) policies are correctly set
- Verify service role permissions

### "Permission denied" errors
- Ensure you're using the service role key, not the anon key
- Check that RLS policies allow the operation
- Verify your Supabase project settings

### "Function does not exist" errors
- Ensure all triggers and functions are created
- Run the complete schema setup, not just individual tables

## Automated Migration

The project includes automated migration scripts:

```bash
# Try automated migration (may not work with all Supabase setups)
npm run db:migrate

# Verify the migration worked
npm run verify:db
```

If automated migration fails, use the manual setup steps above.

## Testing Data

The verification script will automatically seed basic test data:
- 2 products (Total Essential, Total Essential Plus)
- 1 category (Supplements)
- Associated packages for each product

This test data is required for the checkout tests to run successfully.

## Production Considerations

### Security
- All tables have Row Level Security (RLS) enabled
- Service role access is restricted to server-side operations
- User data is isolated by authentication policies

### Performance
- Indexes are created on frequently queried columns
- Updated_at triggers maintain timestamp consistency
- JSONB metadata columns allow flexible data storage

### Backup
- Regular Supabase backups are recommended
- Export schema and data before major changes
- Test migration scripts in development first