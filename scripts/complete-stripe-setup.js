#!/usr/bin/env node
/**
 * complete-stripe-setup.js
 * 
 * A comprehensive setup script for Stripe integration with La Belle Vie.
 * This script automates the setup process for Stripe integration with Supabase.
 * 
 * Features:
 * - Environment variable validation
 * - Stripe connection testing
 * - Database migration for Stripe tables
 * - Webhook endpoint configuration
 * - Integration validation
 * 
 * Usage:
 * node scripts/complete-stripe-setup.js [--force] [--skip-webhooks] [--skip-migrations]
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
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
const FORCE_MODE = args.includes('--force');
const SKIP_WEBHOOKS = args.includes('--skip-webhooks');
const SKIP_MIGRATIONS = args.includes('--skip-migrations');

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

const STRIPE_WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'checkout.session.expired',
  'payment_intent.payment_failed'
];

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for user input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Helper function for colored console output
const log = {
  info: (msg) => console.log(chalk.blue('ℹ️ INFO: ') + msg),
  success: (msg) => console.log(chalk.green('✅ SUCCESS: ') + msg),
  warning: (msg) => console.log(chalk.yellow('⚠️ WARNING: ') + msg),
  error: (msg) => console.log(chalk.red('❌ ERROR: ') + msg),
  step: (msg) => console.log(chalk.cyan('\n📋 STEP: ') + chalk.cyan.bold(msg)),
  instruction: (msg) => console.log(chalk.magenta('📝 INSTRUCTION: ') + msg)
};

/**
 * Main setup function
 */
async function main() {
  try {
    console.log(chalk.bold('\n🚀 FIBRE ELITE GLOW - STRIPE INTEGRATION SETUP 🚀\n'));
    
    // Step 1: Check environment variables
    log.step('Checking environment variables');
    const envCheckResult = checkEnvironmentVariables();
    
    if (!envCheckResult.success && !FORCE_MODE) {
      log.error('Environment variable check failed. Use --force to continue anyway.');
      process.exit(1);
    }
    
    // Step 2: Initialize clients
    log.step('Initializing Stripe and Supabase clients');
    const stripe = initStripeClient();
    const supabase = initSupabaseClient();
    
    // Step 3: Test Stripe connection
    log.step('Testing Stripe connection');
    await testStripeConnection(stripe);
    
    // Step 4: Run database migrations
    if (!SKIP_MIGRATIONS) {
      log.step('Running database migrations for Stripe tables');
      await runDatabaseMigrations(supabase);
    } else {
      log.warning('Skipping database migrations (--skip-migrations flag used)');
    }
    
    // Step 5: Set up webhook endpoints
    if (!SKIP_WEBHOOKS) {
      log.step('Setting up Stripe webhook endpoints');
      await setupWebhooks(stripe);
    } else {
      log.warning('Skipping webhook setup (--skip-webhooks flag used)');
    }
    
    // Step 6: Validate integration
    log.step('Validating the complete integration');
    await validateIntegration(stripe, supabase);
    
    // Step 7: Final instructions
    log.step('Setup completed');
    displayFinalInstructions();
    
    log.success('Stripe integration setup completed successfully!');
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    rl.close();
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
    log.instruction('Create a .env.local file with the required variables. See .env.example for reference.');
  }
  
  if (warnings.length > 0) {
    for (const warning of warnings) {
      log.warning(warning);
    }
  }
  
  return {
    success: missing.length === 0,
    missing,
    warnings
  };
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
    log.success('Stripe client initialized');
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
    
    log.success('Supabase admin client initialized');
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
    throw error;
  }
}

/**
 * Run database migrations for Stripe tables
 */
async function runDatabaseMigrations(supabase) {
  try {
    log.info('Running Stripe database migrations...');
    
    // First check if the tables already exist
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .in('tablename', ['checkout_sessions', 'secrets']);
    
    if (tablesError) {
      log.warning(`Could not check for existing tables: ${tablesError.message}`);
      log.warning('Will attempt to run migrations anyway.');
    } else if (tables && tables.length >= 2) {
      log.info('Stripe tables already exist in the database.');
      
      const proceed = await prompt('Tables already exist. Do you want to run migrations anyway? (y/N): ');
      if (proceed.toLowerCase() !== 'y') {
        log.info('Skipping database migrations.');
        return;
      }
    }
    
    // Read the migration file
    const migrationFile = path.join(process.cwd(), 'supabase/database-stripe-migration.sql');
    if (!fs.existsSync(migrationFile)) {
      throw new Error('Migration file not found: supabase/database-stripe-migration.sql');
    }
    
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');
    
    // Execute the migration
    log.info('Executing migration SQL...');
    
    // Split the SQL into statements and execute them one by one
    const statements = migrationSql
      .split(';')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');
    
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        log.warning(`SQL error (non-fatal): ${error.message}`);
        log.warning('Continuing with remaining statements...');
      }
    }
    
    // Verify tables were created
    const { data: verifyTables, error: verifyError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .in('tablename', ['checkout_sessions', 'secrets']);
    
    if (verifyError) {
      log.warning(`Could not verify table creation: ${verifyError.message}`);
    } else if (!verifyTables || verifyTables.length < 2) {
      throw new Error('Migration did not create the required tables');
    } else {
      log.success(`Migration successful: ${verifyTables.length} tables verified`);
    }
    
    // Store Stripe webhook secret in Supabase secrets table if available
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      log.info('Storing Stripe webhook secret in Supabase secrets table...');
      
      const { error: secretError } = await supabase
        .from('secrets')
        .upsert({
          key: 'STRIPE_WEBHOOK_SECRET',
          value: process.env.STRIPE_WEBHOOK_SECRET,
          description: 'Stripe webhook signing secret',
        }, { onConflict: 'key' });
      
      if (secretError) {
        log.warning(`Failed to store webhook secret in database: ${secretError.message}`);
      } else {
        log.success('Webhook secret stored in Supabase secrets table');
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Database migration failed: ${error.message}`);
    throw error;
  }
}

/**
 * Set up webhook endpoints in Stripe
 */
async function setupWebhooks(stripe) {
  try {
    log.info('Checking existing webhook endpoints...');
    
    // Get base URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      baseUrl = await prompt('Enter your application base URL (e.g., https://fibreeliteglow.com): ');
      if (!baseUrl) {
        throw new Error('Base URL is required for webhook setup');
      }
    }
    
    // Normalize base URL
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`;
    log.info(`Using webhook URL: ${webhookUrl}`);
    
    // List existing webhooks
    const webhooks = await stripe.webhookEndpoints.list();
    const existingWebhook = webhooks.data.find(webhook => 
      webhook.url === webhookUrl
    );
    
    if (existingWebhook) {
      log.info(`Webhook endpoint already exists with ID: ${existingWebhook.id}`);
      
      // Check if all required events are enabled
      const missingEvents = STRIPE_WEBHOOK_EVENTS.filter(
        event => !existingWebhook.enabled_events.includes(event)
      );
      
      if (missingEvents.length > 0) {
        log.warning(`Webhook is missing these events: ${missingEvents.join(', ')}`);
        const update = await prompt('Do you want to update the webhook with these events? (y/N): ');
        
        if (update.toLowerCase() === 'y') {
          await stripe.webhookEndpoints.update(existingWebhook.id, {
            enabled_events: STRIPE_WEBHOOK_EVENTS,
          });
          log.success('Webhook events updated');
        }
      } else {
        log.success('Webhook is configured with all required events');
      }
      
      // Display the webhook secret
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        log.warning('STRIPE_WEBHOOK_SECRET is not set in your environment variables');
        log.instruction('Add this webhook secret to your .env.local file:');
        log.instruction(`STRIPE_WEBHOOK_SECRET=${existingWebhook.secret || '[Get from Stripe Dashboard]'}`);
      }
    } else {
      log.info('No matching webhook endpoint found. Creating a new one...');
      
      // Create new webhook endpoint
      const webhook = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: STRIPE_WEBHOOK_EVENTS,
        description: 'La Belle Vie webhook (created by setup script)',
      });
      
      log.success(`Webhook created with ID: ${webhook.id}`);
      log.success(`Webhook signing secret: ${webhook.secret}`);
      log.instruction('Add this webhook secret to your .env.local file:');
      log.instruction(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
      
      // Store in Supabase secrets if possible
      try {
        const supabase = initSupabaseClient();
        await supabase
          .from('secrets')
          .upsert({
            key: 'STRIPE_WEBHOOK_SECRET',
            value: webhook.secret,
            description: 'Stripe webhook signing secret',
          }, { onConflict: 'key' });
        
        log.success('Webhook secret automatically stored in Supabase secrets table');
      } catch (error) {
        log.warning(`Could not store webhook secret in database: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Webhook setup failed: ${error.message}`);
    throw error;
  }
}

/**
 * Validate the complete integration
 */
async function validateIntegration(stripe, supabase) {
  try {
    log.info('Validating Stripe integration...');
    
    // 1. Check Stripe account status
    const account = await stripe.account.retrieve();
    if (!account.charges_enabled && process.env.NODE_ENV === 'production') {
      log.warning('Your Stripe account cannot process live charges yet. Complete Stripe onboarding.');
    }
    
    // 2. Check database tables
    log.info('Checking database tables...');
    const requiredTables = ['checkout_sessions', 'secrets', 'orders'];
    for (const table of requiredTables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        log.warning(`Table '${table}' check failed: ${error.message}`);
      } else {
        log.success(`Table '${table}' exists in the database`);
      }
    }
    
    // 3. Check webhook configuration
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      log.success('Webhook secret is configured in environment');
      
      // Check if secret is stored in Supabase
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
    } else {
      log.warning('STRIPE_WEBHOOK_SECRET is not set in your environment');
    }
    
    // 4. Verify Stripe product existence
    log.info('Checking for products in Stripe...');
    const products = await stripe.products.list({ limit: 5 });
    
    if (products.data.length === 0) {
      log.warning('No products found in your Stripe account');
      log.instruction('Create products and prices in the Stripe dashboard or via the API');
    } else {
      log.success(`Found ${products.data.length} products in your Stripe account`);
    }
    
    log.success('Integration validation completed');
    return true;
  } catch (error) {
    log.error(`Integration validation failed: ${error.message}`);
    throw error;
  }
}

/**
 * Display final instructions
 */
function displayFinalInstructions() {
  console.log('\n' + chalk.bold.green('🎉 STRIPE INTEGRATION SETUP COMPLETED 🎉') + '\n');
  console.log(chalk.bold('Next Steps:'));
  
  console.log(chalk.cyan('\n1. Environment Variables'));
  console.log('   Make sure all required environment variables are set in production:');
  console.log('   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  console.log('   - NEXT_PUBLIC_BASE_URL');
  
  console.log(chalk.cyan('\n2. Test the Integration'));
  console.log('   Run the end-to-end tests to verify the integration:');
  console.log('   $ pnpm test:e2e');
  
  console.log(chalk.cyan('\n3. Test Webhook Locally'));
  console.log('   Use the Stripe CLI to test webhooks locally:');
  console.log('   $ stripe listen --forward-to localhost:3000/api/webhooks/stripe');
  
  console.log(chalk.cyan('\n4. Production Deployment'));
  console.log('   Before deploying to production:');
  console.log('   - Set NEXT_PUBLIC_STRIPE_TEST_MODE=false or remove it');
  console.log('   - Ensure webhook endpoints point to your production URL');
  console.log('   - Use live Stripe API keys (sk_live_... and pk_live_...)');
  
  console.log(chalk.cyan('\n5. Monitoring'));
  console.log('   Monitor webhook events in the Stripe Dashboard:');
  console.log('   https://dashboard.stripe.com/webhooks');
  
  console.log('\nFor more information, refer to:');
  console.log('- STRIPE_INTEGRATION_GUIDE.md');
  console.log('- CHECKOUT_TESTING_GUIDE.md');
}

// Run the script
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
