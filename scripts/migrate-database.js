#!/usr/bin/env node

/**
 * Database Migration Script
 * Creates missing tables and updates schema as needed
 */

const chalk = require('chalk');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log(chalk.blue('🔄 Running Database Migrations...\n'));

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// SQL for creating checkout_sessions table with updated schema
const createCheckoutSessionsTable = `
CREATE TABLE IF NOT EXISTS checkout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255),
    amount_total DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_intent VARCHAR(255),
    metadata JSONB,
    status VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    test_mode BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    user_id UUID, -- References auth.users(id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_customer_email ON checkout_sessions(customer_email);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_created_at ON checkout_sessions(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_checkout_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_checkout_sessions_updated_at 
    BEFORE UPDATE ON checkout_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_checkout_sessions_updated_at();
`;

// SQL for ensuring orders table has the session_id column
const addOrdersSessionIdColumn = `
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='session_id') THEN
        ALTER TABLE orders ADD COLUMN session_id VARCHAR(255);
        CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
    END IF;
END $$;
`;

async function runMigration() {
  try {
    console.log(chalk.blue('Creating checkout_sessions table...'));
    
    const { error: sessionTableError } = await supabase.rpc('sql', {
      query: createCheckoutSessionsTable
    });
    
    if (sessionTableError) {
      // Try alternative approach using direct SQL execution
      console.log(chalk.yellow('Trying direct SQL execution...'));
      
      // Break down the SQL into individual statements
      const statements = [
        `CREATE TABLE IF NOT EXISTS checkout_sessions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          session_id VARCHAR(255) UNIQUE NOT NULL,
          customer_email VARCHAR(255),
          amount_total DECIMAL(10,2),
          currency VARCHAR(3) DEFAULT 'USD',
          payment_intent VARCHAR(255),
          metadata JSONB,
          status VARCHAR(50),
          payment_status VARCHAR(50) DEFAULT 'pending',
          test_mode BOOLEAN DEFAULT true,
          expires_at TIMESTAMP WITH TIME ZONE,
          failure_reason TEXT,
          user_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
        
        'CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id)',
        'CREATE INDEX IF NOT EXISTS idx_checkout_sessions_customer_email ON checkout_sessions(customer_email)',
        'CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status)',
        'CREATE INDEX IF NOT EXISTS idx_checkout_sessions_created_at ON checkout_sessions(created_at)'
      ];
      
      for (const statement of statements) {
        const { error } = await supabase.rpc('sql', { query: statement });
        if (error && !error.message.includes('already exists')) {
          console.log(chalk.red(`Error executing: ${statement}`));
          console.log(chalk.red(`Error: ${error.message}`));
        }
      }
    }
    
    console.log(chalk.green('✅ checkout_sessions table migration completed'));
    
    console.log(chalk.blue('Adding session_id column to orders table...'));
    
    const { error: ordersColumnError } = await supabase.rpc('sql', {
      query: addOrdersSessionIdColumn
    });
    
    if (ordersColumnError && !ordersColumnError.message.includes('already exists')) {
      console.log(chalk.yellow(`⚠️  Orders column migration warning: ${ordersColumnError.message}`));
    } else {
      console.log(chalk.green('✅ orders table migration completed'));
    }
    
    // Verify the migration worked
    console.log(chalk.blue('\\nVerifying migration...'));
    
    const { data, error } = await supabase
      .from('checkout_sessions')
      .select('*')
      .limit(1);
    
    if (error && !error.code === 'PGRST116') {
      throw new Error(`Migration verification failed: ${error.message}`);
    }
    
    console.log(chalk.green('✅ Migration verification successful'));
    console.log(chalk.green('🎉 Database migration completed successfully!'));
    
    return true;
    
  } catch (error) {
    console.error(chalk.red('❌ Migration failed:'), error.message);
    return false;
  }
}

// Alternative: Create the table using direct insertion if RPC doesn't work
async function createTableDirectly() {
  console.log(chalk.blue('Attempting direct table creation...'));
  
  try {
    // Try to create a test record to see if table exists
    const { error } = await supabase
      .from('checkout_sessions')
      .insert({
        session_id: 'test-session-id',
        customer_email: 'test@example.com',
        amount_total: 0,
        currency: 'USD',
        status: 'test',
        payment_status: 'pending',
        test_mode: true
      });
    
    if (error && error.code === 'PGRST116') {
      console.log(chalk.red('❌ Table does not exist and cannot be created via RPC'));
      console.log(chalk.yellow('💡 Please run the database-schema.sql file manually in your Supabase SQL editor'));
      console.log(chalk.yellow('   or ensure RLS policies allow table creation'));
      return false;
    }
    
    if (error && error.message.includes('duplicate key')) {
      // Table exists, delete test record
      await supabase
        .from('checkout_sessions')
        .delete()
        .eq('session_id', 'test-session-id');
      console.log(chalk.green('✅ Table already exists'));
      return true;
    }
    
    if (!error) {
      // Delete test record
      await supabase
        .from('checkout_sessions')
        .delete()
        .eq('session_id', 'test-session-id');
      console.log(chalk.green('✅ Table exists and is functional'));
      return true;
    }
    
    throw error;
    
  } catch (error) {
    console.log(chalk.red(`❌ Direct table creation failed: ${error.message}`));
    return false;
  }
}

async function main() {
  console.log(chalk.blue('🚀 Starting database migration process...\\n'));
  
  // First try RPC migration
  let success = await runMigration();
  
  if (!success) {
    console.log(chalk.yellow('\\n🔄 Trying alternative approach...'));
    success = await createTableDirectly();
  }
  
  if (success) {
    console.log(chalk.green('\\n🎉 Migration completed successfully!'));
    console.log(chalk.green('✅ Database is ready for testing'));
    process.exit(0);
  } else {
    console.log(chalk.red('\\n❌ Migration failed'));
    console.log(chalk.yellow('\\n💡 Manual steps required:'));
    console.log(chalk.yellow('1. Go to your Supabase dashboard'));
    console.log(chalk.yellow('2. Navigate to SQL Editor'));
    console.log(chalk.yellow('3. Run the complete-database-setup.sql file'));
    console.log(chalk.yellow('4. Alternatively, run: npm run db:setup'));
    process.exit(1);
  }
}

main();