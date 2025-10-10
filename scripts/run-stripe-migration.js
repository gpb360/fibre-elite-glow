#!/usr/bin/env node
/**
 * run-stripe-migration.js
 * 
 * A simplified script to run the Stripe database migration using Supabase MCP.
 * This script:
 * 1. Uses existing dependencies from package.json
 * 2. Runs the Stripe database migration using Supabase client
 * 3. Validates the migration was successful
 * 4. Uses programmatic database interaction as preferred
 * 5. Works with the existing environment configuration
 * 
 * Usage:
 * node scripts/run-stripe-migration.js [--force]
 */

// Import required modules from existing dependencies
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Parse command line arguments
const args = process.argv.slice(2);
const FORCE_MODE = args.includes('--force');

// Required tables that should exist after migration
const REQUIRED_TABLES = ['checkout_sessions', 'secrets', 'user_roles'];

// Helper function for colored console output
const log = {
  info: (msg) => console.log(chalk.blue('ℹ️ INFO: ') + msg),
  success: (msg) => console.log(chalk.green('✅ SUCCESS: ') + msg),
  warning: (msg) => console.log(chalk.yellow('⚠️ WARNING: ') + msg),
  error: (msg) => console.log(chalk.red('❌ ERROR: ') + msg),
  step: (msg) => console.log(chalk.cyan('\n📋 STEP: ') + chalk.cyan.bold(msg))
};

/**
 * Initialize Supabase client with service role key
 */
function initSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key in environment variables');
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
 * Check if tables already exist in the database
 */
async function checkExistingTables(supabase) {
  log.info('Validating presence of required Stripe tables…');

  const existingTables = [];
  const missingTables = [];

  // simplest & most portable: try to `select` head from each table
  for (const table of REQUIRED_TABLES) {
    const { error } = await supabase.from(table).select('*', { head: true, count: 'exact' });

    if (error && error.code === '42P01') {
      // undefined_table
      missingTables.push(table);
    } else if (error) {
      // Some other error – we warn but treat table as missing
      log.warning(`Unable to query table "${table}": ${error.message}`);
      missingTables.push(table);
    } else {
      existingTables.push(table);
    }
  }

  if (existingTables.length) {
    log.info(`Detected tables: ${existingTables.join(', ')}`);
  }
  if (missingTables.length) {
    log.warning(`Missing tables: ${missingTables.join(', ')}`);
  }

  return {
    exists: missingTables.length === 0,
    tables: existingTables,
    missing: missingTables,
  };
}

/**
 * Run the Stripe database migration
 */
async function runMigration(supabase) {
  try {
    log.step('Running Stripe database migration');
    
    // First check if tables already exist
    const { exists, tables, missing } = await checkExistingTables(supabase);
    
    if (exists && !FORCE_MODE) {
      log.success('All required Stripe tables already exist in the database');
      log.info('Use --force flag to run the migration anyway');
      return true;
    }
    
    if (tables.length > 0 && !FORCE_MODE) {
      log.warning(`Some tables already exist, but missing: ${missing.join(', ')}`);
      log.info('Use --force flag to run the migration anyway');
      return false;
    }

    // At this point the script *should* run the migration, but per new requirements
    // we focus on validation only and give clear instructions to the developer.

    const migrationFile = path.join(process.cwd(), 'supabase/database-stripe-migration.sql');
    log.error('Stripe tables are missing.');

    if (!fs.existsSync(migrationFile)) {
      log.error('Migration file "supabase/database-stripe-migration.sql" is not present in project root.');
      return false;
    }

    log.step('Manual migration required');
    console.log(`
      Some required tables are missing:
      - ${missing.join('\n      - ')}

      Run ONE of the following commands to apply the migration:

      1) Using Supabase CLI:
         supabase db push supabase/database-stripe-migration.sql

      2) Using Supabase Dashboard:
         • Open your project -> SQL Editor
         • Paste contents of supabase/database-stripe-migration.sql
         • Run

      Re-run this script afterwards to confirm tables exist.
    `);

    return false;
  } catch (error) {
    log.error(`Migration validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Store webhook secret if it exists and table is ready
 */
async function ensureWebhookSecret(supabase) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return;

  try {
    const { error } = await supabase
      .from('secrets')
      .upsert({
        key: 'STRIPE_WEBHOOK_SECRET',
        value: process.env.STRIPE_WEBHOOK_SECRET,
        description: 'Stripe webhook signing secret',
      }, { onConflict: 'key' });

    if (error) {
      log.warning(`Could not upsert webhook secret: ${error.message}`);
    } else {
      log.success('Webhook secret verified/stored in Supabase secrets table');
    }
  } catch (error) {
    log.warning(`Error storing webhook secret: ${error.message}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.bold('\n🚀 FIBRE ELITE GLOW - STRIPE DATABASE MIGRATION 🚀\n'));
  
  try {
    // Initialize Supabase client
    const supabase = initSupabaseClient();
    
    // Run the migration
    const success = await runMigration(supabase);

    if (success) {
      await ensureWebhookSecret(supabase);
    }
    
    if (success) {
      log.success('Stripe database migration completed successfully');
      process.exit(0);
    } else {
      log.error('Stripe database migration failed or was incomplete');
      process.exit(1);
    }
  } catch (error) {
    log.error(`Script failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
