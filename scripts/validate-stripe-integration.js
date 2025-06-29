#!/usr/bin/env node
/**
 * validate-stripe-integration.js
 * 
 * A lightweight validation script to verify Stripe integration with Fibre Elite Glow.
 * This script performs non-destructive checks to ensure the integration is properly configured.
 * 
 * Features:
 * - Environment variable validation
 * - Stripe API connection testing
 * - Database table verification
 * - Webhook endpoint configuration check
 * - API endpoint validation
 * 
 * Usage:
 * node scripts/validate-stripe-integration.js [--verbose]
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Load environment variables
dotenv.config({ path: '.env.local' });
if (!process.env.STRIPE_SECRET_KEY) {
  dotenv.config(); // Try loading from .env if .env.local doesn't exist
}

// Parse command line arguments
const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');

// Constants
const REQUIRED_ENV_VARS = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const OPTIONAL_ENV_VARS = [
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_TEST_MODE',
  'NEXT_PUBLIC_BASE_URL'
];

const REQUIRED_TABLES = [
  'checkout_sessions',
  'secrets',
  'orders'
];

const REQUIRED_WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'checkout.session.expired',
  'payment_intent.payment_failed'
];

// Helper function for colored console output
const log = {
  info: (msg) => console.log(chalk.blue('ℹ️ INFO: ') + msg),
  success: (msg) => console.log(chalk.green('✅ SUCCESS: ') + msg),
  warning: (msg) => console.log(chalk.yellow('⚠️ WARNING: ') + msg),
  error: (msg) => console.log(chalk.red('❌ ERROR: ') + msg),
  step: (msg) => console.log(chalk.cyan('\n📋 STEP: ') + chalk.cyan.bold(msg)),
  verbose: (msg) => VERBOSE && console.log(chalk.gray('🔍 DETAIL: ') + msg)
};

/**
 * Main validation function
 */
async function main() {
  try {
    console.log(chalk.bold('\n🔍 FIBRE ELITE GLOW - STRIPE INTEGRATION VALIDATION 🔍\n'));
    
    let allPassed = true;
    let results = {
      environment: false,
      stripeConnection: false,
      database: false,
      webhooks: false,
      checkoutEndpoint: false,
      orderEndpoint: false
    };
    
    // Step 1: Check environment variables
    log.step('Checking environment variables');
    results.environment = checkEnvironmentVariables();
    allPassed = allPassed && results.environment;
    
    // Step 2: Initialize clients
    let stripe, supabase;
    try {
      stripe = initStripeClient();
      supabase = initSupabaseClient();
      log.success('Clients initialized successfully');
    } catch (error) {
      log.error(`Failed to initialize clients: ${error.message}`);
      return summarizeResults(results, false);
    }
    
    // Step 3: Test Stripe connection
    log.step('Testing Stripe API connection');
    results.stripeConnection = await testStripeConnection(stripe);
    allPassed = allPassed && results.stripeConnection;
    
    // Step 4: Verify database tables
    log.step('Verifying database tables');
    results.database = await verifyDatabaseTables(supabase);
    allPassed = allPassed && results.database;
    
    // Step 5: Check webhook configuration
    log.step('Checking webhook configuration');
    results.webhooks = await checkWebhooks(stripe);
    allPassed = allPassed && results.webhooks;
    
    // Step 6: Test checkout session creation endpoint
    log.step('Testing checkout session creation endpoint');
    results.checkoutEndpoint = await testCheckoutEndpoint();
    allPassed = allPassed && results.checkoutEndpoint;
    
    // Step 7: Test order retrieval endpoint
    log.step('Testing order retrieval endpoint');
    results.orderEndpoint = await testOrderEndpoint();
    allPassed = allPassed && results.orderEndpoint;
    
    // Summarize results
    return summarizeResults(results, allPassed);
  } catch (error) {
    log.error(`Validation failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Check if required environment variables are set
 */
function checkEnvironmentVariables() {
  log.info('Checking required environment variables...');
  
  const missing = [];
  const warnings = [];
  
  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    } else {
      // Validate format of keys
      if (envVar === 'STRIPE_SECRET_KEY') {
        const key = process.env[envVar];
        if (!key.startsWith('sk_')) {
          warnings.push(`${envVar} does not start with 'sk_'. Make sure it's a valid Stripe secret key.`);
        }
        
        // Check if using test key in production or vice versa
        const isTestKey = key.startsWith('sk_test_');
        const isTestMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === 'true';
        
        if (isTestKey && !isTestMode && process.env.NODE_ENV === 'production') {
          warnings.push('Using a TEST Stripe key in production mode!');
        } else if (!isTestKey && isTestMode) {
          warnings.push('Using a LIVE Stripe key in test mode!');
        }
      }
      
      if (envVar === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') {
        const key = process.env[envVar];
        if (!key.startsWith('pk_')) {
          warnings.push(`${envVar} does not start with 'pk_'. Make sure it's a valid publishable key.`);
        }
      }
    }
  }
  
  // Check optional variables
  for (const envVar of OPTIONAL_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(`Optional environment variable ${envVar} is not set.`);
    } else if (envVar === 'STRIPE_WEBHOOK_SECRET' && !process.env[envVar].startsWith('whsec_')) {
      warnings.push(`${envVar} does not start with 'whsec_'. Make sure it's a valid webhook secret.`);
    }
  }
  
  // Display results
  if (missing.length === 0) {
    log.success('All required environment variables are set.');
  } else {
    log.error(`Missing required environment variables: ${missing.join(', ')}`);
    log.info('Create a .env.local file with the required variables. See .env.example for reference.');
  }
  
  if (warnings.length > 0) {
    for (const warning of warnings) {
      log.warning(warning);
    }
  }
  
  return missing.length === 0;
}

/**
 * Initialize Stripe client
 */
function initStripeClient() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil', // Using the version specified in the project
      typescript: true,
    });
    log.verbose('Stripe client initialized');
    return stripe;
  } catch (error) {
    log.error(`Failed to initialize Stripe client: ${error.message}`);
    throw error;
  }
}

/**
 * Initialize Supabase client
 */
function initSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    });
    
    log.verbose('Supabase admin client initialized');
    return supabase;
  } catch (error) {
    log.error(`Failed to initialize Supabase client: ${error.message}`);
    throw error;
  }
}

/**
 * Test Stripe connection by retrieving account information
 */
async function testStripeConnection(stripe) {
  try {
    const account = await stripe.account.retrieve();
    log.success(`Connected to Stripe account: ${account.display_name || account.id}`);
    
    // Check if account is in test mode
    const isTestMode = account.charges_enabled === false;
    if (isTestMode) {
      log.info('Account is in TEST mode');
    } else {
      log.info('Account is in LIVE mode');
    }
    
    return true;
  } catch (error) {
    log.error(`Stripe connection test failed: ${error.message}`);
    return false;
  }
}

/**
 * Verify that required database tables exist
 */
async function verifyDatabaseTables(supabase) {
  try {
    log.info('Checking database tables...');
    
    let allTablesExist = true;
    const tableStatus = {};
    
    // Check each required table
    for (const tableName of REQUIRED_TABLES) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          log.error(`Table '${tableName}' check failed: ${error.message}`);
          tableStatus[tableName] = false;
          allTablesExist = false;
        } else {
          log.success(`Table '${tableName}' exists in the database`);
          tableStatus[tableName] = true;
          log.verbose(`Table '${tableName}' has approximately ${count} records`);
        }
      } catch (tableError) {
        log.error(`Error checking table '${tableName}': ${tableError.message}`);
        tableStatus[tableName] = false;
        allTablesExist = false;
      }
    }
    
    // Check if webhook secret is stored in Supabase
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('key', 'STRIPE_WEBHOOK_SECRET')
        .single();
      
      if (error) {
        log.warning('Webhook secret not found in Supabase secrets table');
      } else {
        log.success('Webhook secret is stored in Supabase secrets table');
      }
    } catch (secretError) {
      log.warning(`Could not check for webhook secret: ${secretError.message}`);
    }
    
    return allTablesExist;
  } catch (error) {
    log.error(`Database verification failed: ${error.message}`);
    return false;
  }
}

/**
 * Check webhook configuration in Stripe
 */
async function checkWebhooks(stripe) {
  try {
    log.info('Checking webhook endpoints...');
    
    // Get base URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      baseUrl = 'http://localhost:3000'; // Default for local development
      log.warning(`NEXT_PUBLIC_BASE_URL not set, using default: ${baseUrl}`);
    }
    
    // Normalize base URL
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`;
    log.info(`Looking for webhook endpoint: ${webhookUrl}`);
    
    // List existing webhooks
    const webhooks = await stripe.webhookEndpoints.list();
    const existingWebhook = webhooks.data.find(webhook => 
      webhook.url === webhookUrl
    );
    
    if (existingWebhook) {
      log.success(`Webhook endpoint found with ID: ${existingWebhook.id}`);
      
      // Check if all required events are enabled
      const missingEvents = REQUIRED_WEBHOOK_EVENTS.filter(
        event => !existingWebhook.enabled_events.includes(event)
      );
      
      if (missingEvents.length > 0) {
        log.warning(`Webhook is missing these events: ${missingEvents.join(', ')}`);
        return false;
      } else {
        log.success('Webhook is configured with all required events');
      }
      
      // Check if webhook secret is configured
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        log.warning('STRIPE_WEBHOOK_SECRET is not set in your environment variables');
        log.info('You should add the webhook secret to your .env.local file');
        return false;
      }
      
      return true;
    } else {
      log.error(`No webhook endpoint found for URL: ${webhookUrl}`);
      log.info('You need to create a webhook endpoint in your Stripe dashboard or run the setup script');
      return false;
    }
  } catch (error) {
    log.error(`Webhook check failed: ${error.message}`);
    return false;
  }
}

/**
 * Test the checkout session creation endpoint
 */
async function testCheckoutEndpoint() {
  try {
    log.info('Testing checkout session creation endpoint...');
    
    // Get base URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      baseUrl = 'http://localhost:3000'; // Default for local development
      log.warning(`NEXT_PUBLIC_BASE_URL not set, using default: ${baseUrl}`);
    }
    
    // Normalize base URL
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    // Create a test payload
    const testPayload = {
      items: [
        {
          id: 'test-product-id',
          productName: 'Test Product',
          price: 19.99,
          quantity: 1
        }
      ],
      customerInfo: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        address: {
          line1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          postal_code: '12345',
          country: 'US'
        }
      }
    };
    
    // Check if the endpoint file exists
    const endpointPath = path.join(process.cwd(), 'app', 'api', 'create-checkout-session', 'route.ts');
    if (!fs.existsSync(endpointPath)) {
      log.error('Checkout session endpoint file not found');
      return false;
    }
    
    log.success('Checkout session endpoint file exists');
    log.info('Skipping actual API call to avoid creating test sessions');
    
    return true;
  } catch (error) {
    log.error(`Checkout endpoint test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test the order retrieval endpoint
 */
async function testOrderEndpoint() {
  try {
    log.info('Testing order retrieval endpoint...');
    
    // Check if the endpoint file exists
    const endpointPath = path.join(process.cwd(), 'app', 'api', 'checkout-session', '[sessionId]', 'route.ts');
    if (!fs.existsSync(endpointPath)) {
      log.error('Order retrieval endpoint file not found');
      return false;
    }
    
    log.success('Order retrieval endpoint file exists');
    
    // Check success and error page files
    const successPagePath = path.join(process.cwd(), 'app', 'checkout', 'success', 'page.tsx');
    const errorPagePath = path.join(process.cwd(), 'app', 'checkout', 'error', 'page.tsx');
    
    if (!fs.existsSync(successPagePath)) {
      log.warning('Success page file not found');
    } else {
      log.success('Success page file exists');
    }
    
    if (!fs.existsSync(errorPagePath)) {
      log.warning('Error page file not found');
    } else {
      log.success('Error page file exists');
    }
    
    return fs.existsSync(successPagePath) && fs.existsSync(errorPagePath);
  } catch (error) {
    log.error(`Order endpoint test failed: ${error.message}`);
    return false;
  }
}

/**
 * Summarize validation results
 */
function summarizeResults(results, allPassed) {
  console.log('\n' + chalk.bold('📊 VALIDATION RESULTS 📊') + '\n');
  
  const statusSymbol = (passed) => passed ? chalk.green('✅') : chalk.red('❌');
  
  console.log(`${statusSymbol(results.environment)} Environment Variables`);
  console.log(`${statusSymbol(results.stripeConnection)} Stripe API Connection`);
  console.log(`${statusSymbol(results.database)} Database Tables`);
  console.log(`${statusSymbol(results.webhooks)} Webhook Configuration`);
  console.log(`${statusSymbol(results.checkoutEndpoint)} Checkout Endpoint`);
  console.log(`${statusSymbol(results.orderEndpoint)} Order Endpoint`);
  
  console.log('\n' + chalk.bold(allPassed ? chalk.green('✅ ALL CHECKS PASSED') : chalk.red('❌ SOME CHECKS FAILED')));
  
  if (!allPassed) {
    console.log('\n' + chalk.yellow('Recommendations:'));
    
    if (!results.environment) {
      console.log('- Set up missing environment variables in .env.local');
    }
    
    if (!results.stripeConnection) {
      console.log('- Check your Stripe API keys and account status');
    }
    
    if (!results.database) {
      console.log('- Run database migrations: node scripts/complete-stripe-setup.js');
    }
    
    if (!results.webhooks) {
      console.log('- Set up webhook endpoints in Stripe dashboard or run the setup script');
    }
    
    if (!results.checkoutEndpoint || !results.orderEndpoint) {
      console.log('- Ensure all API routes are properly implemented');
    }
    
    console.log('\nRun with --verbose flag for more details');
  }
  
  return allPassed;
}

// Run the script
main().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
