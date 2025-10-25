#!/usr/bin/env node

// Test script to check the exact query used by usePackages hook
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPackagesQuery() {
  console.log('🔍 Testing the exact query from usePackages hook...\n');
  
  try {
    // Replicate the exact query from usePackages
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

    // Add product_type filter
    const productType = 'total_essential';
    query = query.eq('product_type', productType);

    console.log('📋 Running query with filters:');
    console.log('  - is_active: true');
    console.log(`  - product_type: ${productType}`);
    console.log('  - order by: quantity (ascending)');
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Error running query:', error.message);
      console.error('Error details:', error);
      return;
    }
    
    console.log(`\n📦 Found ${data.length} packages matching the query`);
    
    if (data.length === 0) {
      console.log('⚠️  No packages found! This explains the $0.00 pricing issue.');
      
      // Let's check what packages exist without filters
      console.log('\n🔍 Checking all packages without filters...');
      const { data: allData, error: allError } = await supabase
        .from('packages')
        .select('*');
      
      if (allError) {
        console.error('❌ Error fetching all packages:', allError.message);
        return;
      }
      
      console.log(`📦 Found ${allData.length} total packages`);
      allData.forEach(pkg => {
        console.log(`  - ${pkg.product_name}: $${pkg.price} (active: ${pkg.is_active})`);
      });
      
      // Check specific product type
      console.log(`\n🔍 Checking packages with product_type '${productType}'...`);
      const { data: specificData, error: specificError } = await supabase
        .from('packages')
        .select('*')
        .eq('product_type', productType);
      
      if (specificError) {
        console.error('❌ Error fetching specific product type:', specificError.message);
        return;
      }
      
      console.log(`📦 Found ${specificData.length} packages with product_type '${productType}'`);
      specificData.forEach(pkg => {
        console.log(`  - ${pkg.product_name}: $${pkg.price} (active: ${pkg.is_active})`);
      });
    } else {
      console.log('\n✅ Packages found! Sample data:');
      data.forEach(pkg => {
        console.log(`  - ${pkg.product_name}: $${pkg.price} (quantity: ${pkg.quantity})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testPackagesQuery();
