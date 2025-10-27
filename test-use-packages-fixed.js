#!/usr/bin/env node

// Simulate usePackages hook behavior
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simulateUsePackages() {
  console.log('🔍 Simulating usePackages hook behavior...\n');
  
  const productType = 'total_essential';
  console.log(`📋 Product type: ${productType}`);
  
  try {
    // Simulate the query from usePackages hook
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
      console.error('❌ Error fetching packages:', error.message);
      return;
    }

    console.log(`📦 Raw data from Supabase (${data.length} packages):`);
    data.forEach((pkg, index) => {
      console.log(`\nPackage ${index + 1}:`);
      console.log(`  id: ${pkg.id}`);
      console.log(`  product_name: ${pkg.product_name}`);
      console.log(`  product_type: ${pkg.product_type}`);
      console.log(`  quantity: ${pkg.quantity}`);
      console.log(`  price: ${pkg.price} (type: ${typeof pkg.price})`);
      console.log(`  original_price: ${pkg.original_price}`);
      console.log(`  savings: ${pkg.savings}`);
      console.log(`  is_popular: ${pkg.is_popular}`);
      console.log(`  is_active: ${pkg.is_active}`);
    });

    // Transform data to match Package interface
    const transformedPackages = data.map(pkg => ({
      id: pkg.id,
      product_name: pkg.product_name,
      product_type: pkg.product_type,
      quantity: pkg.quantity,
      price: pkg.price,
      original_price: pkg.original_price,
      savings: pkg.savings,
      is_popular: pkg.is_popular,
    }));

    console.log(`\n🔄 Transformed data (${transformedPackages.length} packages):`);
    transformedPackages.forEach((pkg, index) => {
      console.log(`\nTransformed Package ${index + 1}:`);
      console.log(`  id: ${pkg.id}`);
      console.log(`  product_name: ${pkg.product_name}`);
      console.log(`  price: ${pkg.price} (type: ${typeof pkg.price})`);
    });

    // Find the most popular package
    const popularPackage = transformedPackages.find(pkg => pkg.is_popular) || transformedPackages[0];
    console.log(`\n🎯 Selected package (most popular or first):`);
    if (popularPackage) {
      console.log(`  id: ${popularPackage.id}`);
      console.log(`  product_name: ${popularPackage.product_name}`);
      console.log(`  price: ${popularPackage.price} (type: ${typeof popularPackage.price})`);
      console.log(`  is_popular: ${popularPackage.is_popular}`);
    } else {
      console.log('  No package found!');
    }

    // Test pricing display
    console.log(`\n💰 Pricing display test:`);
    if (popularPackage) {
      const priceText = `$${popularPackage.price}`;
      console.log(`  Price text: "${priceText}"`);
      console.log(`  Price value: ${popularPackage.price}`);
      console.log(`  Price type: ${typeof popularPackage.price}`);
      
      // Check if price is a valid number
      if (typeof popularPackage.price === 'number' && !isNaN(popularPackage.price)) {
        console.log('  ✅ Price is valid');
      } else {
        console.log('  ❌ Price is invalid');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

simulateUsePackages();
