#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const readline = require('readline');

// --- Configuration ---
// These values should be in your .env.local file.
// Make sure to load them before running the script.
require('dotenv').config({ path: '.env.local' });

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_TEST_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_TEST_WEBHOOK_SECRET,
} = process.env;

// Helper function to create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// Helper function to run a command and print its output
const runCommand = (command, autoConfirm = false) => {
  try {
    console.log(`\n▶️ Running: ${command}`);
    // If autoConfirm is true, pipe 'y' to the command to automatically confirm prompts
    const execOptions = { stdio: 'inherit' };
    const commandToRun = autoConfirm ? `echo y | ${command}` : command;
    const output = execSync(commandToRun, execOptions);
    return output;
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`);
    throw error;
  }
};

// Main function to set up secrets
async function setupSupabaseSecrets() {
  console.log('--- Supabase Secrets Setup ---');
  console.log('This script will help you set the required Stripe secrets in your Supabase project.');
  console.log('Please ensure you have the Supabase CLI installed and are logged in.');

  try {
    // 1. Check for Supabase CLI
    try {
      execSync('supabase --version', { stdio: 'ignore' });
    } catch (e) {
      console.error('\n❌ Supabase CLI not found.');
      console.log('Please install it by following the instructions at: https://supabase.com/docs/guides/cli');
      process.exit(1);
    }

    // 2. Check for required environment variables
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
    ];
    const missingVars = requiredVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      console.error(`\n❌ Missing required environment variables in .env.local: ${missingVars.join(', ')}`);
      console.log('Please ensure your .env.local file is complete.');
      process.exit(1);
    }
    
    // 3. Get Supabase Project ID
    const url = new URL(NEXT_PUBLIC_SUPABASE_URL);
    const projectId = url.hostname.split('.')[0];
    console.log(`\n✅ Detected Supabase Project ID: ${projectId}`);

    // 4. Define secrets to be set
    const secrets = {
      STRIPE_SECRET_KEY: STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: STRIPE_WEBHOOK_SECRET,
      // Add test keys if they exist
      ...(STRIPE_TEST_SECRET_KEY && { STRIPE_TEST_SECRET_KEY }),
      ...(STRIPE_TEST_WEBHOOK_SECRET && { STRIPE_TEST_WEBHOOK_SECRET }),
    };

    const secretNames = Object.keys(secrets).join(' ');
    console.log('\nThe following secrets will be set:');
    Object.entries(secrets).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value.substring(0, 8)}...`);
    });

    // 5. User confirmation
    const answer = await askQuestion('\nProceed with setting these secrets? (y/n) ');
    if (answer.toLowerCase() !== 'y') {
      console.log('\nOperation cancelled.');
      process.exit(0);
    }

    // 6. Unset existing secrets first to ensure a clean slate
    console.log('\nUnsetting any existing secrets to avoid conflicts...');
    try {
      runCommand(`supabase secrets unset ${secretNames} --project-ref ${projectId}`, true);
    } catch (error) {
      // The `unset` command can fail if the secrets don't exist, which is fine.
      console.warn('⚠️  Could not unset secrets (they may not have been set yet). Continuing...');
    }

    // 7. Set the new secrets
    console.log('\nSetting new secrets...');
    const secretValues = Object.entries(secrets).map(([key, value]) => `${key}=${value}`).join(' ');
    runCommand(`supabase secrets set ${secretValues} --project-ref ${projectId}`);

    console.log('\n✅ Successfully set Supabase secrets!');
    console.log('Your Netlify deployment should now be able to access these keys.');

  } catch (error) {
    console.error('\nAn error occurred during the setup process:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupSupabaseSecrets();
