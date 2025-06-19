#!/usr/bin/env node

/**
 * Stripe MCP Server Setup Script
 * 
 * This script helps you set up the Stripe Model Context Protocol server
 * for your e-commerce application.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Stripe MCP Server...\n');

// Check if .env.local exists and has Stripe keys
const envPath = path.join(process.cwd(), '.env.local');
let hasStripeKey = false;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  hasStripeKey = envContent.includes('STRIPE_SECRET_KEY=sk_') && 
                 !envContent.includes('STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here');
}

if (!hasStripeKey) {
  console.log('⚠️  Stripe API key not found or not configured properly.');
  console.log('\n📋 To set up Stripe MCP server, you need to:');
  console.log('1. Create a Stripe account at https://stripe.com');
  console.log('2. Get your API keys from https://dashboard.stripe.com/apikeys');
  console.log('3. Update the .env.local file with your actual Stripe keys');
  console.log('\n📝 Replace these values in .env.local:');
  console.log('   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key');
  console.log('   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key');
  console.log('\n🔧 Once configured, run this command to start the MCP server:');
  console.log('   npx @stripe/mcp --tools=all --api-key=$STRIPE_SECRET_KEY');
  console.log('\n📚 Available tools you can configure:');
  console.log('   - customers.create, customers.read, customers.update');
  console.log('   - products.create, products.read, products.update');
  console.log('   - prices.create, prices.read, prices.update');
  console.log('   - payment_intents.create, payment_intents.read');
  console.log('   - checkout.sessions.create');
  console.log('   - invoices.create, invoices.read');
  console.log('   - subscriptions.create, subscriptions.read');
  console.log('\n💡 For our e-commerce setup, we recommend:');
  console.log('   npx @stripe/mcp --tools=customers.create,customers.read,products.create,products.read,prices.create,prices.read,payment_intents.create,checkout.sessions.create --api-key=$STRIPE_SECRET_KEY');
  
  process.exit(1);
}

console.log('✅ Stripe API key found in .env.local');

// Try to start the MCP server with recommended tools
const recommendedTools = [
  'customers.create',
  'customers.read', 
  'products.create',
  'products.read',
  'prices.create',
  'prices.read',
  'payment_intents.create',
  'checkout.sessions.create'
].join(',');

console.log('\n🔧 Starting Stripe MCP server with recommended tools...');
console.log(`Tools: ${recommendedTools}`);

try {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey || stripeKey.includes('your_stripe_secret_key_here')) {
    throw new Error('Stripe secret key not properly configured');
  }
  
  console.log('\n🚀 Running: npx @stripe/mcp --tools=' + recommendedTools + ' --api-key=' + stripeKey.substring(0, 12) + '...');
  
  // Execute the MCP server command
  execSync(`npx @stripe/mcp --tools=${recommendedTools} --api-key=${stripeKey}`, {
    stdio: 'inherit',
    env: { ...process.env, STRIPE_SECRET_KEY: stripeKey }
  });
  
} catch (error) {
  console.error('\n❌ Error starting Stripe MCP server:', error.message);
  console.log('\n🔧 Manual setup command:');
  console.log(`npx @stripe/mcp --tools=${recommendedTools} --api-key=$STRIPE_SECRET_KEY`);
  process.exit(1);
}
