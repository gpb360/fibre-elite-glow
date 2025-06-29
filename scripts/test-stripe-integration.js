#!/usr/bin/env node
/**
 * Stripe Integration Test Script
 * 
 * This script tests the complete Stripe integration for the Fibre Elite Glow application.
 * It verifies environment variables, tests connections, and validates the setup.
 * 
 * Usage:
 *   node scripts/test-stripe-integration.js
 */

// Load environment variables from .env files
require('dotenv').config();

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const chalk = require('chalk');
const readline = require('readline');
const { promisify } = require('util');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');

// Create readline interface for interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question method
const question = promisify(rl.question).bind(rl);

// Configuration
const REQUIRED_ENV_VARS = {
  stripe: [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY'
  ],
  supabase: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ],
  app: [
    'NEXT_PUBLIC_BASE_URL'
  ]
};

const REQUIRED_TABLES = [
  'checkout_sessions',
  'secrets',
  'orders',
  'user_roles'
];

const REQUIRED_API_ROUTES = [
  '/api/create-checkout-session',
  '/api/webhooks/stripe',
  '/api/checkout-session/test-session-id'
];

// Test results storage
const testResults = {
  environment: { passed: 0, failed: 0, warnings: 0, details: [] },
  stripe: { passed: 0, failed: 0, warnings: 0, details: [] },
  supabase: { passed: 0, failed: 0, warnings: 0, details: [] },
  apiRoutes: { passed: 0, failed: 0, warnings: 0, details: [] },
  webhooks: { passed: 0, failed: 0, warnings: 0, details: [] }
};

/**
 * Check if all required environment variables are set
 */
async function checkEnvironmentVariables() {
  console.log(chalk.blue('\n🔍 Checking environment variables...'));
  
  let allValid = true;
  let testMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === 'true' || 
                 process.env.NODE_ENV === 'development';
  
  // Check Stripe variables
  console.log(chalk.cyan('\n  Stripe Configuration:'));
  for (const envVar of REQUIRED_ENV_VARS.stripe) {
    const value = process.env[envVar];
    
    if (!value) {
      console.log(chalk.red(`  ❌ ${envVar} is not set`));
      testResults.environment.failed++;
      testResults.environment.details.push({
        name: envVar,
        status: 'failed',
        message: `${envVar} is not set in .env`
      });
      allValid = false;
      continue;
    }
    
    // Validate key format
    let isValid = true;
    let warning = null;
    
    if (envVar === 'STRIPE_SECRET_KEY') {
      if (!value.startsWith('sk_')) {
        isValid = false;
      } else if (testMode && !value.startsWith('sk_test_')) {
        warning = 'Using live key in test mode';
      } else if (!testMode && value.startsWith('sk_test_')) {
        warning = 'Using test key in live mode';
      }
    }
    
    if (envVar === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') {
      if (!value.startsWith('pk_')) {
        isValid = false;
      } else if (testMode && !value.startsWith('pk_test_')) {
        warning = 'Using live key in test mode';
      } else if (!testMode && value.startsWith('pk_test_')) {
        warning = 'Using test key in live mode';
      }
    }
    
    if (!isValid) {
      console.log(chalk.red(`  ❌ ${envVar} has invalid format`));
      testResults.environment.failed++;
      testResults.environment.details.push({
        name: envVar,
        status: 'failed',
        message: `${envVar} has invalid format`
      });
      allValid = false;
    } else if (warning) {
      console.log(chalk.yellow(`  ⚠️  ${envVar}: ${warning}`));
      testResults.environment.warnings++;
      testResults.environment.details.push({
        name: envVar,
        status: 'warning',
        message: warning
      });
    } else {
      console.log(chalk.green(`  ✅ ${envVar} is set correctly`));
      testResults.environment.passed++;
      testResults.environment.details.push({
        name: envVar,
        status: 'passed'
      });
    }
  }
  
  // Check Supabase variables
  console.log(chalk.cyan('\n  Supabase Configuration:'));
  for (const envVar of REQUIRED_ENV_VARS.supabase) {
    const value = process.env[envVar];
    
    if (!value) {
      console.log(chalk.red(`  ❌ ${envVar} is not set`));
      testResults.environment.failed++;
      testResults.environment.details.push({
        name: envVar,
        status: 'failed',
        message: `${envVar} is not set in .env`
      });
      allValid = false;
    } else {
      console.log(chalk.green(`  ✅ ${envVar} is set`));
      testResults.environment.passed++;
      testResults.environment.details.push({
        name: envVar,
        status: 'passed'
      });
    }
  }
  
  // Check app variables
  console.log(chalk.cyan('\n  App Configuration:'));
  for (const envVar of REQUIRED_ENV_VARS.app) {
    const value = process.env[envVar];
    
    if (!value) {
      console.log(chalk.yellow(`  ⚠️  ${envVar} is not set, using default`));
      testResults.environment.warnings++;
      testResults.environment.details.push({
        name: envVar,
        status: 'warning',
        message: `${envVar} is not set, using default`
      });
    } else {
      try {
        // Validate URL format
        new URL(value);
        console.log(chalk.green(`  ✅ ${envVar} is set correctly`));
        testResults.environment.passed++;
        testResults.environment.details.push({
          name: envVar,
          status: 'passed'
        });
      } catch (e) {
        console.log(chalk.red(`  ❌ ${envVar} is not a valid URL`));
        testResults.environment.failed++;
        testResults.environment.details.push({
          name: envVar,
          status: 'failed',
          message: `${envVar} is not a valid URL`
        });
        allValid = false;
      }
    }
  }
  
  // Check webhook secret
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log(chalk.yellow('\n⚠️  STRIPE_WEBHOOK_SECRET is not set. Webhooks will not work correctly.'));
    testResults.environment.warnings++;
    testResults.environment.details.push({
      name: 'STRIPE_WEBHOOK_SECRET',
      status: 'warning',
      message: 'Not set. Webhooks will not work correctly'
    });
  } else {
    if (!process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
      console.log(chalk.red('\n❌ STRIPE_WEBHOOK_SECRET has invalid format. Should start with "whsec_"'));
      testResults.environment.failed++;
      testResults.environment.details.push({
        name: 'STRIPE_WEBHOOK_SECRET',
        status: 'failed',
        message: 'Invalid format. Should start with "whsec_"'
      });
      allValid = false;
    } else {
      console.log(chalk.green('\n✅ STRIPE_WEBHOOK_SECRET is set correctly'));
      testResults.environment.passed++;
      testResults.environment.details.push({
        name: 'STRIPE_WEBHOOK_SECRET',
        status: 'passed'
      });
    }
  }
  
  return allValid;
}

/**
 * Test Stripe API connectivity
 */
async function testStripeConnectivity() {
  console.log(chalk.blue('\n🔌 Testing Stripe API connectivity...'));
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log(chalk.red('  ❌ Cannot test Stripe API: STRIPE_SECRET_KEY is not set'));
    testResults.stripe.failed++;
    testResults.stripe.details.push({
      name: 'API Connection',
      status: 'failed',
      message: 'STRIPE_SECRET_KEY is not set'
    });
    return false;
  }
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Test basic API call
    console.log(chalk.cyan('  Testing API key validity...'));
    const balance = await stripe.balance.retrieve();
    
    console.log(chalk.green('  ✅ Successfully connected to Stripe API'));
    testResults.stripe.passed++;
    testResults.stripe.details.push({
      name: 'API Connection',
      status: 'passed'
    });
    
    // Check account details
    console.log(chalk.cyan('  Retrieving account information...'));
    const account = await stripe.accounts.retrieve();
    
    console.log(chalk.green(`  ✅ Connected to Stripe account: ${account.display_name || account.id}`));
    console.log(chalk.cyan(`     Account type: ${account.type}`));
    console.log(chalk.cyan(`     Default currency: ${account.default_currency?.toUpperCase()}`));
    
    testResults.stripe.passed++;
    testResults.stripe.details.push({
      name: 'Account Information',
      status: 'passed',
      message: `Connected to: ${account.display_name || account.id}`
    });
    
    // Check if test mode matches environment
    const isTestMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === 'true' || 
                      process.env.NODE_ENV === 'development';
    const isTestKey = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
    
    if (isTestMode !== isTestKey) {
      console.log(chalk.yellow(`  ⚠️  Environment mismatch: ${isTestMode ? 'Test mode' : 'Live mode'} environment with ${isTestKey ? 'test' : 'live'} API key`));
      testResults.stripe.warnings++;
      testResults.stripe.details.push({
        name: 'Environment Match',
        status: 'warning',
        message: `${isTestMode ? 'Test mode' : 'Live mode'} environment with ${isTestKey ? 'test' : 'live'} API key`
      });
    } else {
      console.log(chalk.green(`  ✅ Environment matches API key: ${isTestMode ? 'Test mode' : 'Live mode'}`));
      testResults.stripe.passed++;
      testResults.stripe.details.push({
        name: 'Environment Match',
        status: 'passed'
      });
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red(`  ❌ Failed to connect to Stripe API: ${error.message}`));
    testResults.stripe.failed++;
    testResults.stripe.details.push({
      name: 'API Connection',
      status: 'failed',
      message: error.message
    });
    return false;
  }
}

/**
 * Verify Supabase connection and required tables
 */
async function verifySupabaseTables() {
  console.log(chalk.blue('\n🗃️  Verifying Supabase connection and tables...'));
  
  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(chalk.red('  ❌ Cannot connect to Supabase: Missing required environment variables'));
    testResults.supabase.failed++;
    testResults.supabase.details.push({
      name: 'Connection',
      status: 'failed',
      message: 'Missing required environment variables'
    });
    return false;
  }
  
  try {
    // Connect to Supabase with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    console.log(chalk.green('  ✅ Successfully connected to Supabase'));
    testResults.supabase.passed++;
    testResults.supabase.details.push({
      name: 'Connection',
      status: 'passed'
    });
    
    // Check for required tables
    console.log(chalk.cyan('  Checking required tables...'));
    
    for (const tableName of REQUIRED_TABLES) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count(*)')
          .limit(1);
        
        if (error) {
          console.log(chalk.red(`  ❌ Table "${tableName}" error: ${error.message}`));
          testResults.supabase.failed++;
          testResults.supabase.details.push({
            name: `Table: ${tableName}`,
            status: 'failed',
            message: error.message
          });
        } else {
          console.log(chalk.green(`  ✅ Table "${tableName}" exists`));
          testResults.supabase.passed++;
          testResults.supabase.details.push({
            name: `Table: ${tableName}`,
            status: 'passed'
          });
        }
      } catch (err) {
        console.log(chalk.red(`  ❌ Error checking table "${tableName}": ${err.message}`));
        testResults.supabase.failed++;
        testResults.supabase.details.push({
          name: `Table: ${tableName}`,
          status: 'failed',
          message: err.message
        });
      }
    }
    
    // Check for secrets in the secrets table
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('key')
        .eq('key', 'STRIPE_SECRET_KEY')
        .single();
      
      if (error || !data) {
        console.log(chalk.yellow('  ⚠️  STRIPE_SECRET_KEY not found in secrets table'));
        testResults.supabase.warnings++;
        testResults.supabase.details.push({
          name: 'Secrets: STRIPE_SECRET_KEY',
          status: 'warning',
          message: 'Not found in secrets table'
        });
      } else {
        console.log(chalk.green('  ✅ STRIPE_SECRET_KEY found in secrets table'));
        testResults.supabase.passed++;
        testResults.supabase.details.push({
          name: 'Secrets: STRIPE_SECRET_KEY',
          status: 'passed'
        });
      }
      
      const { data: webhookData, error: webhookError } = await supabase
        .from('secrets')
        .select('key')
        .eq('key', 'STRIPE_WEBHOOK_SECRET')
        .single();
      
      if (webhookError || !webhookData) {
        console.log(chalk.yellow('  ⚠️  STRIPE_WEBHOOK_SECRET not found in secrets table'));
        testResults.supabase.warnings++;
        testResults.supabase.details.push({
          name: 'Secrets: STRIPE_WEBHOOK_SECRET',
          status: 'warning',
          message: 'Not found in secrets table'
        });
      } else {
        console.log(chalk.green('  ✅ STRIPE_WEBHOOK_SECRET found in secrets table'));
        testResults.supabase.passed++;
        testResults.supabase.details.push({
          name: 'Secrets: STRIPE_WEBHOOK_SECRET',
          status: 'passed'
        });
      }
    } catch (err) {
      console.log(chalk.red(`  ❌ Error checking secrets: ${err.message}`));
      testResults.supabase.failed++;
      testResults.supabase.details.push({
        name: 'Secrets',
        status: 'failed',
        message: err.message
      });
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red(`  ❌ Failed to connect to Supabase: ${error.message}`));
    testResults.supabase.failed++;
    testResults.supabase.details.push({
      name: 'Connection',
      status: 'failed',
      message: error.message
    });
    return false;
  }
}

/**
 * Test API routes respond correctly
 */
async function testApiRoutes() {
  console.log(chalk.blue('\n🌐 Testing API routes...'));
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Check if app is running
  let appRunning = false;
  try {
    const response = await fetch(baseUrl, { method: 'HEAD', timeout: 5000 });
    appRunning = response.ok;
  } catch (error) {
    console.log(chalk.yellow(`  ⚠️  Could not connect to ${baseUrl}. Is the app running?`));
    console.log(chalk.yellow('     Start the app with "pnpm dev" to test API routes'));
    testResults.apiRoutes.warnings++;
    testResults.apiRoutes.details.push({
      name: 'App Running',
      status: 'warning',
      message: `Could not connect to ${baseUrl}`
    });
    return false;
  }
  
  if (!appRunning) {
    console.log(chalk.yellow(`  ⚠️  Could not connect to ${baseUrl}. Is the app running?`));
    console.log(chalk.yellow('     Start the app with "pnpm dev" to test API routes'));
    testResults.apiRoutes.warnings++;
    testResults.apiRoutes.details.push({
      name: 'App Running',
      status: 'warning',
      message: `Could not connect to ${baseUrl}`
    });
    return false;
  }
  
  console.log(chalk.green(`  ✅ Connected to app at ${baseUrl}`));
  testResults.apiRoutes.passed++;
  testResults.apiRoutes.details.push({
    name: 'App Running',
    status: 'passed'
  });
  
  // Test each API route
  for (const route of REQUIRED_API_ROUTES) {
    const url = `${baseUrl}${route}`;
    
    try {
      // Use different methods for different routes
      let response;
      if (route === '/api/create-checkout-session') {
        // POST with minimal valid data
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ id: 'test', productName: 'Test Product', price: 10, quantity: 1 }],
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
          })
        });
      } else {
        // GET for other routes
        response = await fetch(url, { method: 'GET' });
      }
      
      // Check response
      if (response.status === 404) {
        console.log(chalk.red(`  ❌ Route "${route}" not found (404)`));
        testResults.apiRoutes.failed++;
        testResults.apiRoutes.details.push({
          name: `Route: ${route}`,
          status: 'failed',
          message: 'Route not found (404)'
        });
      } else if (response.status >= 500) {
        console.log(chalk.red(`  ❌ Route "${route}" server error (${response.status})`));
        testResults.apiRoutes.failed++;
        testResults.apiRoutes.details.push({
          name: `Route: ${route}`,
          status: 'failed',
          message: `Server error (${response.status})`
        });
      } else {
        // For checkout session creation, we expect 401 or similar since we're not authenticated
        // For webhook, we expect 400 since we're not sending a valid signature
        // For checkout session retrieval, we expect 404 since the session ID doesn't exist
        
        if ((route === '/api/create-checkout-session' && response.status === 400) ||
            (route === '/api/webhooks/stripe' && response.status === 400) ||
            (route === '/api/checkout-session/test-session-id' && response.status === 404) ||
            response.ok) {
          console.log(chalk.green(`  ✅ Route "${route}" responds correctly`));
          testResults.apiRoutes.passed++;
          testResults.apiRoutes.details.push({
            name: `Route: ${route}`,
            status: 'passed'
          });
        } else {
          console.log(chalk.yellow(`  ⚠️  Route "${route}" unexpected response (${response.status})`));
          testResults.apiRoutes.warnings++;
          testResults.apiRoutes.details.push({
            name: `Route: ${route}`,
            status: 'warning',
            message: `Unexpected response (${response.status})`
          });
        }
      }
    } catch (error) {
      console.log(chalk.red(`  ❌ Error testing route "${route}": ${error.message}`));
      testResults.apiRoutes.failed++;
      testResults.apiRoutes.details.push({
        name: `Route: ${route}`,
        status: 'failed',
        message: error.message
      });
    }
  }
  
  return true;
}

/**
 * Check webhook endpoint configuration
 */
async function checkWebhookConfiguration() {
  console.log(chalk.blue('\n🔔 Checking webhook configuration...'));
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log(chalk.red('  ❌ Cannot check webhooks: STRIPE_SECRET_KEY is not set'));
    testResults.webhooks.failed++;
    testResults.webhooks.details.push({
      name: 'Webhook Configuration',
      status: 'failed',
      message: 'STRIPE_SECRET_KEY is not set'
    });
    return false;
  }
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`;
    
    // List all webhooks
    const webhooks = await stripe.webhookEndpoints.list();
    
    // Check if our webhook endpoint is configured
    const matchingWebhooks = webhooks.data.filter(webhook => 
      webhook.url === webhookUrl ||
      webhook.url.replace('http://', 'https://') === webhookUrl ||
      webhookUrl.replace('http://', 'https://') === webhook.url
    );
    
    if (matchingWebhooks.length === 0) {
      console.log(chalk.yellow(`  ⚠️  No webhook found for ${webhookUrl}`));
      console.log(chalk.yellow('     You need to configure a webhook in the Stripe Dashboard:'));
      console.log(chalk.cyan(`     https://dashboard.stripe.com/webhooks`));
      console.log(chalk.yellow(`     Endpoint URL: ${webhookUrl}`));
      console.log(chalk.yellow('     Events to send:'));
      console.log(chalk.yellow('     - checkout.session.completed'));
      console.log(chalk.yellow('     - checkout.session.expired'));
      console.log(chalk.yellow('     - payment_intent.payment_failed'));
      
      testResults.webhooks.warnings++;
      testResults.webhooks.details.push({
        name: 'Webhook Endpoint',
        status: 'warning',
        message: `No webhook found for ${webhookUrl}`
      });
    } else {
      console.log(chalk.green(`  ✅ Webhook found for ${webhookUrl}`));
      testResults.webhooks.passed++;
      testResults.webhooks.details.push({
        name: 'Webhook Endpoint',
        status: 'passed'
      });
      
      // Check webhook events
      const webhook = matchingWebhooks[0];
      const requiredEvents = [
        'checkout.session.completed',
        'checkout.session.expired',
        'payment_intent.payment_failed'
      ];
      
      const missingEvents = requiredEvents.filter(event => !webhook.enabled_events.includes(event) && !webhook.enabled_events.includes('*'));
      
      if (missingEvents.length > 0) {
        console.log(chalk.yellow(`  ⚠️  Webhook is missing required events: ${missingEvents.join(', ')}`));
        console.log(chalk.yellow('     Update your webhook in the Stripe Dashboard:'));
        console.log(chalk.cyan(`     https://dashboard.stripe.com/webhooks/${webhook.id}`));
        
        testResults.webhooks.warnings++;
        testResults.webhooks.details.push({
          name: 'Webhook Events',
          status: 'warning',
          message: `Missing required events: ${missingEvents.join(', ')}`
        });
      } else {
        console.log(chalk.green('  ✅ Webhook has all required events configured'));
        testResults.webhooks.passed++;
        testResults.webhooks.details.push({
          name: 'Webhook Events',
          status: 'passed'
        });
      }
      
      // Check if webhook secret is set
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.log(chalk.yellow('  ⚠️  STRIPE_WEBHOOK_SECRET is not set'));
        console.log(chalk.yellow('     Get the signing secret from the Stripe Dashboard:'));
        console.log(chalk.cyan(`     https://dashboard.stripe.com/webhooks/${webhook.id}`));
        
        testResults.webhooks.warnings++;
        testResults.webhooks.details.push({
          name: 'Webhook Secret',
          status: 'warning',
          message: 'STRIPE_WEBHOOK_SECRET is not set'
        });
      } else {
        console.log(chalk.green('  ✅ STRIPE_WEBHOOK_SECRET is set'));
        testResults.webhooks.passed++;
        testResults.webhooks.details.push({
          name: 'Webhook Secret',
          status: 'passed'
        });
      }
    }
    
    // Check for Stripe CLI for local testing
    try {
      const { execSync } = require('child_process');
      execSync('stripe --version', { stdio: 'ignore' });
      
      console.log(chalk.green('  ✅ Stripe CLI is installed for local webhook testing'));
      console.log(chalk.cyan('     Run this command to forward events to your local server:'));
      console.log(chalk.cyan(`     stripe listen --forward-to ${baseUrl}/api/webhooks/stripe`));
      
      testResults.webhooks.passed++;
      testResults.webhooks.details.push({
        name: 'Stripe CLI',
        status: 'passed'
      });
    } catch (error) {
      console.log(chalk.yellow('  ⚠️  Stripe CLI not found. Install it for local webhook testing:'));
      console.log(chalk.cyan('     https://stripe.com/docs/stripe-cli'));
      
      testResults.webhooks.warnings++;
      testResults.webhooks.details.push({
        name: 'Stripe CLI',
        status: 'warning',
        message: 'Not installed'
      });
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red(`  ❌ Failed to check webhook configuration: ${error.message}`));
    testResults.webhooks.failed++;
    testResults.webhooks.details.push({
      name: 'Webhook Configuration',
      status: 'failed',
      message: error.message
    });
    return false;
  }
}

/**
 * Generate a comprehensive test report
 */
function generateReport() {
  console.log(chalk.blue('\n📊 Test Report Summary'));
  console.log(chalk.blue('=========================================='));
  
  const categories = [
    { name: 'Environment Variables', key: 'environment' },
    { name: 'Stripe API', key: 'stripe' },
    { name: 'Supabase Database', key: 'supabase' },
    { name: 'API Routes', key: 'apiRoutes' },
    { name: 'Webhook Configuration', key: 'webhooks' }
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  
  for (const category of categories) {
    const results = testResults[category.key];
    totalPassed += results.passed;
    totalFailed += results.failed;
    totalWarnings += results.warnings;
    
    const statusColor = results.failed > 0 ? 'red' : (results.warnings > 0 ? 'yellow' : 'green');
    const statusSymbol = results.failed > 0 ? '❌' : (results.warnings > 0 ? '⚠️' : '✅');
    
    console.log(chalk[statusColor](`${statusSymbol} ${category.name}:`));
    console.log(chalk.cyan(`   Passed: ${results.passed}, Failed: ${results.failed}, Warnings: ${results.warnings}`));
  }
  
  console.log(chalk.blue('\nOverall Status:'));
  
  const overallStatusColor = totalFailed > 0 ? 'red' : (totalWarnings > 0 ? 'yellow' : 'green');
  const overallStatus = totalFailed > 0 ? 'FAILED' : (totalWarnings > 0 ? 'PASSED WITH WARNINGS' : 'PASSED');
  const overallSymbol = totalFailed > 0 ? '❌' : (totalWarnings > 0 ? '⚠️' : '✅');
  
  console.log(chalk[overallStatusColor](`${overallSymbol} Overall Status: ${overallStatus}`));
  console.log(chalk.cyan(`   Total Passed: ${totalPassed}, Total Failed: ${totalFailed}, Total Warnings: ${totalWarnings}`));
  
  // Generate recommendations based on test results
  console.log(chalk.blue('\nRecommendations:'));
  
  const recommendations = [];
  
  // Environment recommendations
  const envFailed = testResults.environment.details.filter(d => d.status === 'failed');
  if (envFailed.length > 0) {
    recommendations.push(`Set missing environment variables: ${envFailed.map(d => d.name).join(', ')}`);
  }
  
  // Stripe recommendations
  if (testResults.stripe.failed > 0) {
    recommendations.push('Check Stripe API key and account settings');
  }
  
  // Supabase recommendations
  if (testResults.supabase.details.some(d => d.name.startsWith('Table:') && d.status === 'failed')) {
    recommendations.push('Run database migrations to create missing tables');
  }
  
  // Secret recommendations
  if (testResults.supabase.details.some(d => d.name.startsWith('Secrets:') && d.status === 'warning')) {
    recommendations.push('Store Stripe secrets in Supabase secrets table using setup-supabase-secrets.js script');
  }
  
  // API route recommendations
  if (testResults.apiRoutes.failed > 0) {
    recommendations.push('Ensure all API routes are implemented and the app is running');
  }
  
  // Webhook recommendations
  if (testResults.webhooks.details.some(d => d.name === 'Webhook Endpoint' && d.status === 'warning')) {
    recommendations.push('Configure webhook endpoint in Stripe Dashboard');
  }
  
  if (recommendations.length > 0) {
    recommendations.forEach((rec, i) => {
      console.log(chalk.cyan(`${i + 1}. ${rec}`));
    });
  } else {
    console.log(chalk.green('✅ All tests passed! Your Stripe integration is ready to use.'));
  }
  
  // Next steps
  console.log(chalk.blue('\nNext Steps:'));
  console.log(chalk.cyan('1. Run the app: pnpm dev'));
  console.log(chalk.cyan('2. Test a complete checkout flow with a test card'));
  console.log(chalk.cyan('3. Check that orders are created in the database'));
  console.log(chalk.cyan('4. Verify webhook events are processed correctly'));
  
  return {
    passed: totalPassed,
    failed: totalFailed,
    warnings: totalWarnings,
    status: overallStatus
  };
}

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.green('🔍 Stripe Integration Test'));
  console.log(chalk.green('========================'));
  
  try {
    // Check for required files
    const requiredFiles = [
      'app/api/create-checkout-session/route.ts',
      'app/api/webhooks/stripe/route.ts',
      'database-stripe-migration.sql',
      'src/lib/stripe.ts'
    ];
    
    console.log(chalk.blue('\n📁 Checking required files...'));
    
    let allFilesExist = true;
    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fileExists(filePath)) {
        console.log(chalk.green(`  ✅ ${file} exists`));
      } else {
        console.log(chalk.red(`  ❌ ${file} not found`));
        allFilesExist = false;
      }
    }
    
    if (!allFilesExist) {
      console.log(chalk.yellow('\n⚠️  Some required files are missing. Make sure you have implemented all necessary files.'));
      const shouldContinue = await question(chalk.yellow('Continue with tests anyway? (y/N): '));
      if (shouldContinue.toLowerCase() !== 'y') {
        console.log(chalk.blue('\nExiting tests. Please implement all required files and try again.'));
        process.exit(1);
      }
    }
    
    // Run all tests
    await checkEnvironmentVariables();
    await testStripeConnectivity();
    await verifySupabaseTables();
    await testApiRoutes();
    await checkWebhookConfiguration();
    
    // Generate report
    const report = generateReport();
    
    // Exit with appropriate code
    process.exit(report.failed > 0 ? 1 : 0);
  } catch (err) {
    console.error(chalk.red(`\n❌ Error: ${err.message}`));
    process.exit(1);
  } finally {
    // Close readline interface
    rl.close();
  }
}

// Run the script
main();
