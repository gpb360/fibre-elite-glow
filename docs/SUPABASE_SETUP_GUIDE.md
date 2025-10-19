# 🗄️ Supabase Database Setup Guide for La Belle Vie

## 📋 Overview

This guide will help you set up a comprehensive e-commerce database structure for your La Belle Vie platform, including proper tables for products, images, orders, customers, and more.

## 🚀 Step 1: Reactivate Your Supabase Project

Your current Supabase project (`lyynavswxtzhsmwetgtn`) is currently **INACTIVE**. You need to:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to your project**: `lebelv` (lyynavswxtzhsmwetgtn)
3. **Reactivate the project** (may require upgrading to a paid plan)
4. **Wait for the project to become active**

## 🗃️ Step 2: Run Database Schema

Once your project is active, execute the following SQL files in order:

### 2.1 Create the Schema
Copy and paste the contents of `supabase/database-schema.sql` into your Supabase SQL Editor:

```sql
-- This will create all tables, indexes, and triggers
-- File: supabase/database-schema.sql
```

### 2.2 Insert Sample Data
Copy and paste the contents of `supabase/sample-data.sql` into your Supabase SQL Editor:

```sql
-- This will populate your database with initial product data
-- File: supabase/sample-data.sql
```

## 📊 Database Structure Overview

### Core Tables Created:

1. **categories** - Product categories and subcategories
2. **products** - Main product information
3. **product_images** - Multiple images per product
4. **packages** - Product variants/packages (15-day, 30-day, etc.)
5. **customers** - Customer information
6. **customer_addresses** - Shipping and billing addresses
7. **orders** - Order information
8. **order_items** - Individual items in orders
9. **discount_codes** - Promotional codes and discounts

### Key Features:

- ✅ **UUID Primary Keys** for better security
- ✅ **Proper Foreign Key Relationships**
- ✅ **Enums for Type Safety** (product_type, order_status, payment_status)
- ✅ **Automatic Timestamps** (created_at, updated_at)
- ✅ **Indexes for Performance**
- ✅ **Triggers for Auto-Updates**

## 🔄 Step 3: Update Application Code

### 3.1 Replace Types File
Replace your current `src/integrations/supabase/types.ts` with the new comprehensive types:

```bash
# Backup current types
mv src/integrations/supabase/types.ts src/integrations/supabase/types-old.ts

# Use new types
mv src/integrations/supabase/types-new.ts src/integrations/supabase/types.ts
```

### 3.2 Update usePackages Hook
Update `src/hooks/usePackages.ts` to use real Supabase data instead of mock data:

```typescript
export function usePackages(productType?: 'total_essential' | 'total_essential_plus') {
  return useQuery({
    queryKey: ['packages', productType],
    queryFn: async () => {
      let query = supabase
        .from('packages')
        .select(`
          *,
          products (
            name,
            description,
            short_description
          )
        `)
        .eq('is_active', true)
        .order('quantity', { ascending: true });
      
      if (productType) {
        query = query.eq('product_type', productType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as Package[];
    },
  });
}
```

## 🖼️ Step 4: Image Management Setup

### 4.1 Create Storage Bucket
In your Supabase dashboard:

1. Go to **Storage**
2. Create a new bucket called `product-images`
3. Set it to **Public** for easy access
4. Configure policies for image uploads

### 4.2 Upload Current Images
Your current images are:
- `/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png` (Total Essential)
- `/lovable-uploads/5f8f72e3-397f-47a4-8bce-f15924c32a34.png` (Total Essential Plus)

Upload these to your Supabase storage and update the URLs in the database.

## 📱 Step 5: Google Drive Integration

Once you have access to Google Drive MCP tools, we can:

1. **Fetch all new images** from your Google Drive
2. **Upload them to Supabase Storage**
3. **Update the database** with proper image references
4. **Organize images** by product categories

## 🔧 Step 6: Enable Row Level Security (RLS)

For production security, enable RLS on sensitive tables:

```sql
-- Enable RLS on customer data
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own data" ON customers
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data" ON customers
  FOR UPDATE USING (auth.uid()::text = id);
```

## 🧪 Step 7: Test the Setup

1. **Check Tables**: Verify all tables are created
2. **Test Queries**: Run sample queries to fetch products
3. **Test Cart**: Ensure cart functionality works with real data
4. **Test Images**: Verify image URLs are accessible

## 📈 Step 8: Performance Optimization

After setup, consider:

1. **Add more indexes** based on query patterns
2. **Set up database backups**
3. **Monitor query performance**
4. **Implement caching** for frequently accessed data

## 🎯 Next Steps

Once the database is set up:

1. ✅ **Cart functionality** will work with real data
2. ✅ **Product management** through Supabase dashboard
3. ✅ **Order processing** ready for Stripe integration
4. ✅ **Customer management** system in place
5. ✅ **Image management** through Supabase Storage

## 🆘 Troubleshooting

### Common Issues:

1. **Project Inactive**: Upgrade to paid plan to reactivate
2. **Permission Errors**: Check RLS policies
3. **Image Upload Issues**: Verify storage bucket permissions
4. **Query Errors**: Check table names and column types

### Support:

- **Supabase Docs**: https://supabase.com/docs
- **SQL Reference**: https://www.postgresql.org/docs/
- **Storage Guide**: https://supabase.com/docs/guides/storage

---

**🎉 Once completed, your e-commerce platform will have a robust, scalable database ready for production use!**
