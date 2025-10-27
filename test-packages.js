#!/usr/bin/env node

// Simple test script to check packages table data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPackages() {
  console.log('🔍 Checking packages table...\n');
  
  try {
    // Check total packages
    const { data: allPackages, error: allError } = await supabase
      .from('packages')
      .select('*');
    
    if (allError) {
      console.error('❌ Error fetching packages:', allError.message);
      return;
    }
    
    console.log(`📦 Found ${allPackages.length} total packages`);
    
    // Check total essential packages specifically
    const { data: totalEssentialPackages, error: teError } = await supabase
      .from('packages')
      .select('*')
      .eq('product_type', 'total_essential');
    
    if (teError) {
      console.error('❌ Error fetching total essential packages:', teError.message);
      return;
    }
    
    console.log(`🌱 Found ${totalEssentialPackages.length} Total Essential packages`);
    
    // Check total essential plus packages
    const { data: totalEssentialPlusPackages, error: tepError } = await supabase
      .from('packages')
      .select('*')
      .eq('product_type', 'total_essential_plus');
    
    if (tepError) {
      console.error('❌ Error fetching total essential plus packages:', tepError.message);
      return;
    }
    
    console.log(`💎 Found ${totalEssentialPlusPackages.length} Total Essential Plus packages`);
    
    // Show sample packages
    if (totalEssentialPackages.length > 0) {
      console.log('\n📋 Sample Total Essential Packages:');
      totalEssentialPackages.forEach(pkg => {
        console.log(`  - ${pkg.product_name}: $${pkg.price} (SKU: ${pkg.sku})`);
      });
    }
    
    if (totalEssentialPlusPackages.length > 0) {
      console.log('\n📋 Sample Total Essential Plus Packages:');
      totalEssentialPlusPackages.forEach(pkg => {
        console.log(`  - ${pkg.product_name}: $${pkg.price} (SKU: ${pkg.sku})`);
      });
    }
    
    // Check if active packages exist
    const { data: activePackages, error: activeError } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true);
    
    if (activeError) {
      console.error('❌ Error fetching active packages:', activeError.message);
      return;
    }
    
    console.log(`\n✅ Found ${activePackages.length} active packages`);
    
    if (activePackages.length === 0) {
      console.log('⚠️  No active packages found! This is likely the cause of the $0.00 pricing issue.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkPackages();
