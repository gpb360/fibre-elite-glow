#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates that all required environment variables are set and accessible
 */

const chalk = require('chalk');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log(chalk.blue('🔍 Validating Environment Configuration...\n'));

// Required environment variables
const requiredEnvVars = [
  {
    name: 'STRIPE_SECRET_KEY',
    description: 'Stripe Secret Key',
    validate: (value) => value && value.startsWith('sk_'),
    example: 'sk_test_...'
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    description: 'Stripe Publishable Key',
    validate: (value) => value && value.startsWith('pk_'),
    example: 'pk_test_...'
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    description: 'Stripe Webhook Secret',
    validate: (value) => value && value.startsWith('whsec_'),
    example: 'whsec_...'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase URL',
    validate: (value) => value && value.includes('supabase.co'),
    example: 'https://your-project.supabase.co'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase Anonymous Key',
    validate: (value) => value && value.startsWith('eyJ'),
    example: 'eyJhbGciOiJIUzI1NiIs...'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase Service Role Key',
    validate: (value) => value && value.startsWith('eyJ'),
    example: 'eyJhbGciOiJIUzI1NiIs...'
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    description: 'Base URL',
    validate: (value) => value && value.startsWith('http'),
    example: 'http://localhost:3000'
  }
];

let allValid = true;
let errors = [];

// Check each required variable
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar.name];
  
  if (!value) {
    console.log(chalk.red(`❌ ${envVar.name}: Missing`));
    console.log(chalk.gray(`   Description: ${envVar.description}`));
    console.log(chalk.gray(`   Example: ${envVar.example}\n`));
    allValid = false;
    errors.push(`${envVar.name} is missing`);
  } else if (!envVar.validate(value)) {
    console.log(chalk.red(`❌ ${envVar.name}: Invalid format`));
    console.log(chalk.gray(`   Description: ${envVar.description}`));
    console.log(chalk.gray(`   Example: ${envVar.example}\n`));
    allValid = false;
    errors.push(`${envVar.name} has invalid format`);
  } else {
    console.log(chalk.green(`✅ ${envVar.name}: Valid`));
  }
});

// Test Stripe connection
console.log(chalk.blue('\n🔍 Testing Stripe Connection...\n'));

async function testStripeConnection() {
  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Test API call
    const account = await stripe.accounts.retrieve();
    console.log(chalk.green(`✅ Stripe Connection: Success`));
    console.log(chalk.gray(`   Account ID: ${account.id}`));
    console.log(chalk.gray(`   Test Mode: ${!account.livemode}`));
    
    // Validate test mode
    if (process.env.STRIPE_TEST_MODE === 'true' && account.livemode) {
      console.log(chalk.yellow('⚠️  Warning: Using live Stripe keys in test mode'));
    }
    
  } catch (error) {
    console.log(chalk.red(`❌ Stripe Connection: Failed`));
    console.log(chalk.gray(`   Error: ${error.message}`));
    allValid = false;
    errors.push('Stripe connection failed');
  }
}

// Test Supabase connection
console.log(chalk.blue('\n🔍 Testing Supabase Connection...\n'));

async function testSupabaseConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Test connection with a simple query - try to query our products table
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log(chalk.green(`✅ Supabase Connection: Success`));
    console.log(chalk.gray(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`));
    
  } catch (error) {
    console.log(chalk.red(`❌ Supabase Connection: Failed`));
    console.log(chalk.gray(`   Error: ${error.message}`));
    allValid = false;
    errors.push('Supabase connection failed');
  }
}

// Run tests
async function runValidation() {
  if (allValid) {
    await testStripeConnection();
    await testSupabaseConnection();
  }
  
  console.log(chalk.blue('\n📋 Validation Summary:\n'));
  
  if (allValid && errors.length === 0) {
    console.log(chalk.green('🎉 All environment variables are properly configured!'));
    console.log(chalk.green('✅ Ready for testing and development'));
    process.exit(0);
  } else {
    console.log(chalk.red('❌ Environment validation failed'));
    console.log(chalk.red(`   ${errors.length} error(s) found:`));
    errors.forEach(error => {
      console.log(chalk.red(`   - ${error}`));
    });
    console.log(chalk.yellow('\n💡 Please check your .env.local file and ensure all required variables are set.'));
    console.log(chalk.yellow('   Use .env.local.example as a reference.'));
    process.exit(1);
  }
}

runValidation().catch(error => {
  console.error(chalk.red('❌ Validation script failed:'), error);
  process.exit(1);
});