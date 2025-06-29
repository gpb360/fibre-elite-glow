#!/usr/bin/env node
/**
 * Supabase MCP Setup Script
 * 
 * This script helps set up and verify the Supabase MCP integration by:
 * 1. Checking if required environment variables are set
 * 2. Testing the Supabase connection
 * 3. Verifying the MCP configuration
 * 4. Running database migrations if needed
 * 5. Testing basic database operations
 * 
 * Usage:
 *   node scripts/setup-supabase-mcp.js
 */

// Load environment variables from .env files
const dotenv = require('dotenv');
// 1️⃣  Load generic `.env` first (lowest precedence)
dotenv.config();
// 2️⃣  Then load project-specific `.env.local` if it exists ‑ this will
//     overwrite duplicates from the base `.env` and mirrors Next.js behaviour.
dotenv.config({ path: '.env.local', override: true });

const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Create readline interface for interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question method
const question = promisify(rl.question).bind(rl);

// Configuration
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const REQUIRED_TABLES = [
  'checkout_sessions',
  'secrets',
  'orders',
  'user_roles'
];

const MCP_CONFIG_PATH = path.join(process.cwd(), '.roo', 'mcp.json');

/**
 * Check if all required environment variables are set
 */
async function checkEnvironmentVariables() {
  console.log(chalk.blue('\n🔍 Checking environment variables...'));
  
  let missingVars = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
      console.log(chalk.red(`  ❌ ${envVar} is not set`));
    } else {
      console.log(chalk.green(`  ✅ ${envVar} is set`));
    }
  }
  
  if (missingVars.length > 0) {
    console.log(chalk.yellow('\n⚠️  Some required environment variables are missing.'));
    console.log(chalk.yellow('   Please set them in your .env.local file:'));
    
    missingVars.forEach(envVar => {
      console.log(chalk.cyan(`   ${envVar}=your_${envVar.toLowerCase()}_here`));
    });
    
    const shouldContinue = await question(chalk.yellow('\nDo you want to continue anyway? (y/N): '));
    if (shouldContinue.toLowerCase() !== 'y') {
      console.log(chalk.blue('\nExiting setup. Please set the required environment variables and try again.'));
      return false;
    }
  }
  
  return true;
}

/**
 * Test Supabase connection
 */
async function testSupabaseConnection() {
  console.log(chalk.blue('\n🔌 Testing Supabase connection...'));
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log(chalk.red('  ❌ Cannot test connection: Missing required environment variables'));
    return null;
  }
  
  try {
    // Connect with anon key first (public client)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test a simple query
    // A lightweight query that is RLS-safe and avoids `count(*)` parsing issues
    const { error } = await supabase
      .from('secrets')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.log(chalk.yellow(`  ⚠️  Public client connection warning: ${error.message}`));
      console.log(chalk.yellow('     This might be expected if RLS policies are properly set up.'));
    } else {
      console.log(chalk.green('  ✅ Successfully connected to Supabase with public client'));
    }
    
    // Test service role connection if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      const { error: adminError } = await supabaseAdmin
        .from('secrets')
        .select('id')
        .limit(1);
      
      if (adminError) {
        console.log(chalk.red(`  ❌ Admin client connection failed: ${adminError.message}`));
        return null;
      } else {
        console.log(chalk.green('  ✅ Successfully connected to Supabase with admin client'));
        return supabaseAdmin;
      }
    } else {
      console.log(chalk.yellow('  ⚠️  No service role key provided, skipping admin client test'));
      return null;
    }
  } catch (error) {
    console.log(chalk.red(`  ❌ Failed to connect to Supabase: ${error.message}`));
    return null;
  }
}

/**
 * Check if required tables exist
 */
async function checkRequiredTables(supabaseAdmin) {
  console.log(chalk.blue('\n🗃️  Checking required tables...'));
  
  if (!supabaseAdmin) {
    console.log(chalk.yellow('  ⚠️  No admin client available, skipping table check'));
    return false;
  }
  
  let missingTables = [];
  
  for (const tableName of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(chalk.red(`  ❌ Table "${tableName}" not found or error: ${error.message}`));
        missingTables.push(tableName);
      } else {
        console.log(chalk.green(`  ✅ Table "${tableName}" exists`));
      }
    } catch (err) {
      console.log(chalk.red(`  ❌ Error checking table "${tableName}": ${err.message}`));
      missingTables.push(tableName);
    }
  }
  
  return missingTables;
}

/**
 * Run database migrations
 */
async function runDatabaseMigrations(missingTables) {
  console.log(chalk.blue('\n🔄 Database migration...'));
  
  if (missingTables.length === 0) {
    console.log(chalk.green('  ✅ All required tables exist, no migration needed'));
    return true;
  }
  
  console.log(chalk.yellow(`  ⚠️  Missing tables: ${missingTables.join(', ')}`));
  
  const shouldMigrate = await question(chalk.yellow('  Do you want to run the database migration? (y/N): '));
  if (shouldMigrate.toLowerCase() !== 'y') {
    console.log(chalk.yellow('  ⚠️  Migration skipped. Tables will need to be created manually.'));
    return false;
  }
  
  // Check if migration files exist
  const migrationFiles = [
    'database-schema.sql',
    'database-stripe-migration.sql'
  ];
  
  let missingFiles = [];
  for (const file of migrationFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.log(chalk.red(`  ❌ Missing migration files: ${missingFiles.join(', ')}`));
    console.log(chalk.yellow('     Please make sure these files exist in the project root.'));
    return false;
  }
  
  try {
    // Check if supabase CLI is installed
    try {
      execSync('supabase --version', { stdio: 'ignore' });
      console.log(chalk.green('  ✅ Supabase CLI detected'));
    } catch (error) {
      console.log(chalk.yellow('  ⚠️  Supabase CLI not found. Installing...'));
      try {
        execSync('npm install -g supabase', { stdio: 'inherit' });
        console.log(chalk.green('  ✅ Supabase CLI installed'));
      } catch (installError) {
        console.log(chalk.red(`  ❌ Failed to install Supabase CLI: ${installError.message}`));
        console.log(chalk.yellow('     Please install it manually: npm install -g supabase'));
        return false;
      }
    }
    
    // Run migrations
    console.log(chalk.cyan('  Running database migrations...'));
    
    try {
      console.log(chalk.cyan('  Applying base schema...'));
      execSync('supabase db push database-schema.sql', { stdio: 'inherit' });
      
      console.log(chalk.cyan('  Applying Stripe migration...'));
      execSync('supabase db push database-stripe-migration.sql', { stdio: 'inherit' });
      
      console.log(chalk.green('  ✅ Database migrations applied successfully'));
      return true;
    } catch (migrationError) {
      console.log(chalk.red(`  ❌ Migration failed: ${migrationError.message}`));
      console.log(chalk.yellow('     You may need to apply migrations manually.'));
      
      // Provide manual migration instructions
      console.log(chalk.cyan('\n  Manual migration instructions:'));
      console.log(chalk.cyan('  1. Go to Supabase dashboard: https://app.supabase.io'));
      console.log(chalk.cyan('  2. Select your project'));
      console.log(chalk.cyan('  3. Go to SQL Editor'));
      console.log(chalk.cyan('  4. Copy and paste the contents of database-schema.sql'));
      console.log(chalk.cyan('  5. Run the SQL'));
      console.log(chalk.cyan('  6. Repeat with database-stripe-migration.sql'));
      
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`  ❌ Error during migration: ${error.message}`));
    return false;
  }
}

/**
 * Test basic database operations
 */
async function testDatabaseOperations(supabaseAdmin) {
  console.log(chalk.blue('\n🧪 Testing basic database operations...'));
  
  if (!supabaseAdmin) {
    console.log(chalk.yellow('  ⚠️  No admin client available, skipping database operations test'));
    return false;
  }
  
  try {
    // Test insert operation
    const testKey = `test_key_${Date.now()}`;
    const testValue = `test_value_${Date.now()}`;
    
    console.log(chalk.cyan(`  Inserting test record into secrets table...`));
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('secrets')
      .insert({
        key: testKey,
        value: testValue,
        description: 'Test record from setup script'
      })
      .select();
    
    if (insertError) {
      console.log(chalk.red(`  ❌ Insert operation failed: ${insertError.message}`));
      return false;
    }
    
    console.log(chalk.green('  ✅ Insert operation successful'));
    
    // Test select operation
    console.log(chalk.cyan(`  Reading test record...`));
    const { data: selectData, error: selectError } = await supabaseAdmin
      .from('secrets')
      .select('*')
      .eq('key', testKey)
      .single();
    
    if (selectError || !selectData) {
      console.log(chalk.red(`  ❌ Select operation failed: ${selectError?.message || 'Record not found'}`));
      return false;
    }
    
    if (selectData.value !== testValue) {
      console.log(chalk.red(`  ❌ Data integrity check failed: Expected "${testValue}" but got "${selectData.value}"`));
      return false;
    }
    
    console.log(chalk.green('  ✅ Select operation successful'));
    
    // Test update operation
    const updatedValue = `updated_value_${Date.now()}`;
    console.log(chalk.cyan(`  Updating test record...`));
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('secrets')
      .update({ value: updatedValue })
      .eq('key', testKey)
      .select();
    
    if (updateError) {
      console.log(chalk.red(`  ❌ Update operation failed: ${updateError.message}`));
      return false;
    }
    
    console.log(chalk.green('  ✅ Update operation successful'));
    
    // Test delete operation
    console.log(chalk.cyan(`  Deleting test record...`));
    const { error: deleteError } = await supabaseAdmin
      .from('secrets')
      .delete()
      .eq('key', testKey);
    
    if (deleteError) {
      console.log(chalk.red(`  ❌ Delete operation failed: ${deleteError.message}`));
      return false;
    }
    
    console.log(chalk.green('  ✅ Delete operation successful'));
    console.log(chalk.green('  ✅ All database operations completed successfully'));
    
    return true;
  } catch (error) {
    console.log(chalk.red(`  ❌ Error during database operations test: ${error.message}`));
    return false;
  }
}

/**
 * Verify MCP configuration
 */
async function verifyMcpConfiguration() {
  console.log(chalk.blue('\n🔧 Verifying MCP configuration...'));
  
  try {
    // Check if MCP config file exists
    if (!fs.existsSync(MCP_CONFIG_PATH)) {
      console.log(chalk.red(`  ❌ MCP config file not found at ${MCP_CONFIG_PATH}`));
      return false;
    }
    
    // Read and parse MCP config
    const mcpConfig = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf8'));
    
    // Check if Supabase MCP is configured
    if (!mcpConfig.mcpServers || !mcpConfig.mcpServers.supabase) {
      console.log(chalk.red('  ❌ Supabase MCP server not configured in mcp.json'));
      
      // Ask if user wants to add it
      const shouldAdd = await question(chalk.yellow('  Do you want to add Supabase MCP configuration? (Y/n): '));
      if (shouldAdd.toLowerCase() === 'n') {
        console.log(chalk.yellow('  ⚠️  Skipping MCP configuration.'));
        return false;
      }
      
      // Add Supabase MCP configuration
      mcpConfig.mcpServers = mcpConfig.mcpServers || {};
      mcpConfig.mcpServers.supabase = {
        command: "npx",
        args: [
          "-y",
          "@supabase/mcp"
        ],
        env: {
          "SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}",
          "SUPABASE_ANON_KEY": "${NEXT_PUBLIC_SUPABASE_ANON_KEY}",
          "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
        }
      };
      
      // Write updated config
      fs.writeFileSync(MCP_CONFIG_PATH, JSON.stringify(mcpConfig, null, 2));
      console.log(chalk.green('  ✅ Added Supabase MCP configuration to mcp.json'));
    } else {
      // Verify Supabase MCP configuration
      const supabaseMcp = mcpConfig.mcpServers.supabase;
      
      if (!supabaseMcp.command || !supabaseMcp.args || !supabaseMcp.env) {
        console.log(chalk.yellow('  ⚠️  Supabase MCP configuration appears incomplete'));
        
        // Ask if user wants to fix it
        const shouldFix = await question(chalk.yellow('  Do you want to fix the Supabase MCP configuration? (Y/n): '));
        if (shouldFix.toLowerCase() === 'n') {
          console.log(chalk.yellow('  ⚠️  Skipping MCP configuration fix.'));
          return false;
        }
        
        // Fix Supabase MCP configuration
        mcpConfig.mcpServers.supabase = {
          command: "npx",
          args: [
            "-y",
            "@supabase/mcp"
          ],
          env: {
            "SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}",
            "SUPABASE_ANON_KEY": "${NEXT_PUBLIC_SUPABASE_ANON_KEY}",
            "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
          }
        };
        
        // Write updated config
        fs.writeFileSync(MCP_CONFIG_PATH, JSON.stringify(mcpConfig, null, 2));
        console.log(chalk.green('  ✅ Fixed Supabase MCP configuration in mcp.json'));
      } else {
        console.log(chalk.green('  ✅ Supabase MCP is properly configured'));
      }
    }
    
    // Check if @supabase/mcp package is installed
    try {
      execSync('npm list @supabase/mcp', { stdio: 'ignore' });
      console.log(chalk.green('  ✅ @supabase/mcp package is installed'));
    } catch (error) {
      console.log(chalk.yellow('  ⚠️  @supabase/mcp package not found. Installing...'));
      try {
        execSync('npm install -D @supabase/mcp', { stdio: 'inherit' });
        console.log(chalk.green('  ✅ @supabase/mcp package installed'));
      } catch (installError) {
        console.log(chalk.red(`  ❌ Failed to install @supabase/mcp: ${installError.message}`));
        console.log(chalk.yellow('     Please install it manually: npm install -D @supabase/mcp'));
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red(`  ❌ Error verifying MCP configuration: ${error.message}`));
    return false;
  }
}

/**
 * Display next steps
 */
function displayNextSteps(results) {
  console.log(chalk.blue('\n📋 Setup Summary'));
  console.log(chalk.blue('=========================================='));
  
  const steps = [
    { name: 'Environment Variables', success: results.envVars },
    { name: 'Supabase Connection', success: results.connection },
    { name: 'Database Tables', success: results.tables },
    { name: 'Database Operations', success: results.operations },
    { name: 'MCP Configuration', success: results.mcp }
  ];
  
  steps.forEach(step => {
    const icon = step.success ? '✅' : '⚠️';
    const color = step.success ? 'green' : 'yellow';
    console.log(chalk[color](`${icon} ${step.name}`));
  });
  
  console.log(chalk.blue('\n🚀 Next Steps:'));
  
  if (!results.envVars) {
    console.log(chalk.yellow('1. Set up your environment variables in .env.local'));
  }
  
  if (!results.tables) {
    console.log(chalk.yellow('1. Run database migrations to create required tables'));
    console.log(chalk.cyan('   supabase db push database-schema.sql'));
    console.log(chalk.cyan('   supabase db push database-stripe-migration.sql'));
  }
  
  if (!results.mcp) {
    console.log(chalk.yellow('1. Fix your MCP configuration in .roo/mcp.json'));
    console.log(chalk.cyan('   Add the Supabase MCP server configuration'));
  }
  
  console.log(chalk.green('\n✨ To use Supabase in your application:'));
  console.log(chalk.cyan('1. Import the Supabase client:'));
  console.log(chalk.cyan('   import { supabase } from \'@/integrations/supabase/client\';'));
  console.log(chalk.cyan('2. Use it in your components/API routes:'));
  console.log(chalk.cyan('   const { data, error } = await supabase.from(\'table\').select(\'*\');'));
  
  console.log(chalk.green('\n🔐 For admin operations (server-side only):'));
  console.log(chalk.cyan('1. Import the admin client:'));
  console.log(chalk.cyan('   import { supabaseAdmin } from \'@/integrations/supabase/client\';'));
  console.log(chalk.cyan('2. Use it in API routes (never in client components):'));
  console.log(chalk.cyan('   const { data, error } = await supabaseAdmin.from(\'table\').select(\'*\');'));
  
  console.log(chalk.green('\n📚 Documentation:'));
  console.log(chalk.cyan('• Supabase JS Client: https://supabase.com/docs/reference/javascript/'));
  console.log(chalk.cyan('• Supabase Auth: https://supabase.com/docs/guides/auth/'));
  console.log(chalk.cyan('• Row Level Security: https://supabase.com/docs/guides/auth/row-level-security/'));
  
  console.log(chalk.blue('\nHappy coding! 🎉'));
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.green('🔧 Supabase MCP Setup'));
  console.log(chalk.green('===================='));
  
  const results = {
    envVars: false,
    connection: false,
    tables: false,
    operations: false,
    mcp: false
  };
  
  try {
    // Check environment variables
    results.envVars = await checkEnvironmentVariables();
    if (!results.envVars) {
      displayNextSteps(results);
      process.exit(1);
    }
    
    // Test Supabase connection
    const supabaseAdmin = await testSupabaseConnection();
    results.connection = !!supabaseAdmin;
    
    // Check required tables
    const missingTables = await checkRequiredTables(supabaseAdmin);
    results.tables = missingTables && missingTables.length === 0;
    
    // Run migrations if needed
    if (missingTables && missingTables.length > 0) {
      await runDatabaseMigrations(missingTables);
    }
    
    // Test database operations
    results.operations = await testDatabaseOperations(supabaseAdmin);
    
    // Verify MCP configuration
    results.mcp = await verifyMcpConfiguration();
    
    // Display next steps
    displayNextSteps(results);
    
    // Exit with success/failure code
    const success = Object.values(results).every(Boolean);
    process.exit(success ? 0 : 1);
  } catch (err) {
    console.error(chalk.red(`\n❌ Error: ${err.message}`));
    console.error(chalk.red(err.stack));
    process.exit(1);
  } finally {
    // Close readline interface
    rl.close();
  }
}

// Run the script
main();
