#!/usr/bin/env node
/**
 * Supabase Secrets Setup Script for Stripe Integration
 * 
 * This script helps migrate sensitive Stripe API keys from environment variables
 * to Supabase secrets for better security.
 * 
 * Usage:
 *   node scripts/setup-supabase-secrets.js
 */

// Load environment variables from .env files
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
const chalk = require('chalk');
const { promisify } = require('util');

// Create readline interface for interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question method
const question = promisify(rl.question).bind(rl);

// Configuration
const SECRETS_TABLE = 'secrets';
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

// Secret definitions with descriptions
const STRIPE_SECRETS = [
  {
    key: 'STRIPE_SECRET_KEY',
    description: 'Stripe Secret API Key (starts with sk_)',
    validate: (value) => value && value.startsWith('sk_'),
    required: true
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    description: 'Stripe Webhook Signing Secret (starts with whsec_)',
    validate: (value) => value && value.startsWith('whsec_'),
    required: false
  }
];

/**
 * Connect to Supabase using service role key
 * @returns {Object} Supabase client
 */
function connectToSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error(chalk.red('❌ Missing required environment variables:'));
    REQUIRED_ENV_VARS.forEach(envVar => {
      if (!process.env[envVar]) {
        console.error(chalk.red(`   - ${envVar}`));
      }
    });
    console.error(chalk.yellow('\nPlease add these to your .env file and try again.'));
    process.exit(1);
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Check if the secrets table exists, create it if it doesn't
 * @param {Object} supabase - Supabase client
 */
async function ensureSecretsTableExists(supabase) {
  console.log(chalk.blue('🔍 Checking if secrets table exists...'));
  
  try {
    // Try to query the table to see if it exists
    const { error } = await supabase
      .from(SECRETS_TABLE)
      .select('count(*)')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.log(chalk.yellow('⚠️  Secrets table does not exist. Creating it now...'));
        
        // Create the table using SQL
        const { error: createError } = await supabase.rpc('create_secrets_table', {
          table_name: SECRETS_TABLE
        });
        
        if (createError) {
          console.error(chalk.red(`❌ Failed to create secrets table: ${createError.message}`));
          console.log(chalk.yellow('\nYou may need to run the database migration script first:'));
          console.log(chalk.cyan('  npx supabase db push database-stripe-migration.sql'));
          process.exit(1);
        }
        
        console.log(chalk.green('✅ Secrets table created successfully!'));
      } else {
        console.error(chalk.red(`❌ Error checking secrets table: ${error.message}`));
        process.exit(1);
      }
    } else {
      console.log(chalk.green('✅ Secrets table exists!'));
    }
  } catch (err) {
    console.error(chalk.red(`❌ Unexpected error: ${err.message}`));
    process.exit(1);
  }
}

/**
 * Check if a secret already exists in the table
 * @param {Object} supabase - Supabase client
 * @param {String} key - Secret key
 * @returns {Object|null} Existing secret or null
 */
async function getExistingSecret(supabase, key) {
  const { data, error } = await supabase
    .from(SECRETS_TABLE)
    .select('*')
    .eq('key', key)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Not found is not an error for us
    console.error(chalk.red(`❌ Error checking for existing secret ${key}: ${error.message}`));
    return null;
  }
  
  return data;
}

/**
 * Add or update a secret in the secrets table
 * @param {Object} supabase - Supabase client
 * @param {String} key - Secret key
 * @param {String} value - Secret value
 * @param {String} description - Secret description
 * @returns {Boolean} Success status
 */
async function upsertSecret(supabase, key, value, description) {
  try {
    const { error } = await supabase
      .from(SECRETS_TABLE)
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });
    
    if (error) {
      console.error(chalk.red(`❌ Failed to save secret ${key}: ${error.message}`));
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(chalk.red(`❌ Unexpected error saving secret ${key}: ${err.message}`));
    return false;
  }
}

/**
 * Prompt user for a secret value
 * @param {Object} secretDef - Secret definition
 * @param {String} currentValue - Current value from env var
 * @returns {String} Secret value
 */
async function promptForSecret(secretDef, currentValue) {
  const { key, description, validate, required } = secretDef;
  
  console.log(chalk.cyan(`\n📝 ${description} (${key}):`));
  
  if (currentValue) {
    console.log(chalk.yellow(`   Current value detected in environment: ${maskSecret(currentValue)}`));
  }
  
  if (!required && !currentValue) {
    const shouldAdd = await question(chalk.yellow('   This optional secret is not set. Would you like to add it? (y/N): '));
    if (shouldAdd.toLowerCase() !== 'y') {
      return null;
    }
  }
  
  let value = currentValue;
  let isValid = validate(value);
  
  if (!isValid || !value) {
    value = await question(chalk.yellow(`   Enter value for ${key}${required ? ' (required)' : ''}: `));
    isValid = validate(value);
    
    while (required && !isValid) {
      console.log(chalk.red('   ❌ Invalid value. Please try again.'));
      value = await question(chalk.yellow(`   Enter value for ${key} (required): `));
      isValid = validate(value);
    }
  }
  
  return value;
}

/**
 * Mask a secret for display
 * @param {String} secret - Secret to mask
 * @returns {String} Masked secret
 */
function maskSecret(secret) {
  if (!secret) return '';
  if (secret.length <= 8) return '********';
  return `${secret.substring(0, 4)}${'*'.repeat(secret.length - 8)}${secret.substring(secret.length - 4)}`;
}

/**
 * Display instructions for using Supabase secrets
 */
function showInstructions() {
  console.log(chalk.green('\n✅ Setup complete! Next steps:'));
  
  console.log(chalk.cyan('\n1. Update your code to use Supabase secrets'));
  console.log('   Your secrets are now stored in Supabase and will be automatically');
  console.log('   injected as environment variables in production.');
  
  console.log(chalk.cyan('\n2. For local development:'));
  console.log('   Keep your .env.local file for development, but consider removing');
  console.log('   sensitive keys from any shared .env.example files.');
  
  console.log(chalk.cyan('\n3. Deploy your application'));
  console.log('   When you deploy, Supabase will automatically inject these secrets');
  console.log('   as environment variables, so you don\'t need to configure them in');
  console.log('   your hosting provider.');
  
  console.log(chalk.cyan('\n4. Set up webhook endpoint'));
  console.log('   Configure your Stripe webhook endpoint to point to:');
  console.log(`   ${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'}/api/webhooks/stripe`);
  
  console.log(chalk.yellow('\nRemember: Never commit sensitive keys to your repository!'));
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.green('🔐 Supabase Secrets Setup for Stripe Integration'));
  console.log(chalk.green('================================================'));
  
  try {
    // Connect to Supabase
    console.log(chalk.blue('\n🔌 Connecting to Supabase...'));
    const supabase = connectToSupabase();
    
    // Ensure secrets table exists
    await ensureSecretsTableExists(supabase);
    
    // Detect environment (test/production)
    const isTestMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === 'true' || 
                      process.env.NODE_ENV === 'development';
    
    console.log(chalk.blue(`\n🔧 Setting up secrets for ${isTestMode ? 'TEST' : 'PRODUCTION'} environment`));
    console.log(chalk.yellow('   If this is incorrect, please update NEXT_PUBLIC_STRIPE_TEST_MODE in your .env file.'));
    
    // Process each secret
    for (const secretDef of STRIPE_SECRETS) {
      const { key, description } = secretDef;
      
      // Check if secret already exists
      const existingSecret = await getExistingSecret(supabase, key);
      
      if (existingSecret) {
        console.log(chalk.yellow(`\n⚠️  Secret ${key} already exists in Supabase!`));
        const shouldUpdate = await question(chalk.yellow('   Do you want to update it? (y/N): '));
        
        if (shouldUpdate.toLowerCase() !== 'y') {
          console.log(chalk.blue('   Skipping this secret.'));
          continue;
        }
      }
      
      // Get current value from environment
      const currentValue = process.env[key];
      
      // Prompt for secret value
      const value = await promptForSecret(secretDef, currentValue);
      
      if (value) {
        // Save secret to Supabase
        console.log(chalk.blue(`\n💾 Saving ${key} to Supabase secrets...`));
        const success = await upsertSecret(supabase, key, value, description);
        
        if (success) {
          console.log(chalk.green(`   ✅ Secret ${key} saved successfully!`));
        }
      } else if (!secretDef.required) {
        console.log(chalk.blue(`   Skipping optional secret ${key}.`));
      }
    }
    
    // Show instructions
    showInstructions();
    
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
