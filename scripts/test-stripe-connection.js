#!/usr/bin/env node

/**
 * Test Stripe Connection Script
 * 
 * This script tests the connection to Stripe API to ensure
 * your API keys are working correctly.
 */

require('dotenv').config({ path: '.env.local' });

async function testStripeConnection() {
  console.log('🧪 Testing Stripe API connection...\n');

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey || stripeKey.includes('your_stripe_secret_key_here')) {
    console.log('❌ Stripe secret key not found or not configured.');
    console.log('Please update your .env.local file with your actual Stripe keys.');
    process.exit(1);
  }

  try {
    // Import Stripe
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia',
    });

    console.log('✅ Stripe SDK initialized successfully');
    console.log(`🔑 Using API key: ${stripeKey.substring(0, 12)}...`);

    // Test API connection by retrieving account info
    console.log('\n🔍 Testing API connection...');
    const account = await stripe.accounts.retrieve();
    
    console.log('✅ Successfully connected to Stripe!');
    console.log(`📊 Account ID: ${account.id}`);
    console.log(`🏢 Business Type: ${account.business_type || 'Not set'}`);
    console.log(`🌍 Country: ${account.country}`);
    console.log(`💰 Default Currency: ${account.default_currency}`);

    // Test creating a simple product (will be deleted)
    console.log('\n🛍️ Testing product creation...');
    const testProduct = await stripe.products.create({
      name: 'Test Product - La Belle Vie',
      description: 'This is a test product and will be deleted',
      metadata: {
        test: 'true',
        created_by: 'setup_script'
      }
    });

    console.log('✅ Test product created successfully');
    console.log(`📦 Product ID: ${testProduct.id}`);

    // Clean up - delete the test product
    await stripe.products.del(testProduct.id);
    console.log('🗑️ Test product deleted');

    console.log('\n🎉 All tests passed! Your Stripe integration is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Run the MCP server: npm run stripe:mcp');
    console.log('2. Start building your shopping cart');
    console.log('3. Implement the checkout flow');

  } catch (error) {
    console.error('\n❌ Error testing Stripe connection:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n🔧 This usually means your API key is invalid.');
      console.log('Please check your .env.local file and ensure you have the correct Stripe secret key.');
    }
    
    process.exit(1);
  }
}

// Run the test
testStripeConnection();
