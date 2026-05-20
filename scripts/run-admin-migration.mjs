// Run admin features migration against Supabase
// Usage: node scripts/run-admin-migration.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

async function runMigration() {
  console.log('🔧 Running admin features migration...\n');
  console.log(`   Supabase URL: ${supabaseUrl}`);
  console.log('   Using service role key: ✅\n');

  // Run each statement individually since Supabase REST doesn't support multi-statement transactions
  const statements = [
    // 1. Testimonials table
    {
      label: 'Creating testimonials table',
      sql: `CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        product VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT NOT NULL,
        verified BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        stripe_order_id VARCHAR(255),
        order_number VARCHAR(255),
        admin_notes TEXT,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    },
    // 2. Testimonials indexes
    {
      label: 'Creating testimonials indexes',
      sql: `CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status)`
    },
    {
      label: 'Creating testimonials email index',
      sql: `CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email)`
    },
    {
      label: 'Creating testimonials verified index',
      sql: `CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON testimonials(verified)`
    },
    // 3. Affiliates table
    {
      label: 'Creating affiliates table',
      sql: `CREATE TABLE IF NOT EXISTS affiliates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        affiliate_code VARCHAR(50) UNIQUE NOT NULL,
        commission_percent DECIMAL(5,2) NOT NULL DEFAULT 10.00 CHECK (commission_percent >= 0 AND commission_percent <= 100),
        is_active BOOLEAN DEFAULT true,
        total_sales DECIMAL(10,2) DEFAULT 0,
        total_commission DECIMAL(10,2) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    },
    // 4. Affiliates indexes
    {
      label: 'Creating affiliates indexes',
      sql: `CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code)`
    },
    {
      label: 'Creating affiliates email index',
      sql: `CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email)`
    },
    {
      label: 'Creating affiliates active index',
      sql: `CREATE INDEX IF NOT EXISTS idx_affiliates_active ON affiliates(is_active)`
    },
    // 5. Affiliate sales table
    {
      label: 'Creating affiliate_sales table',
      sql: `CREATE TABLE IF NOT EXISTS affiliate_sales (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
        order_id UUID REFERENCES orders(id),
        order_number VARCHAR(255),
        customer_email VARCHAR(255),
        sale_amount DECIMAL(10,2) NOT NULL,
        commission_amount DECIMAL(10,2) NOT NULL,
        commission_percent DECIMAL(5,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    },
    // 6. Affiliate sales indexes
    {
      label: 'Creating affiliate_sales indexes',
      sql: `CREATE INDEX IF NOT EXISTS idx_affiliate_sales_affiliate ON affiliate_sales(affiliate_id)`
    },
    {
      label: 'Creating affiliate_sales order index',
      sql: `CREATE INDEX IF NOT EXISTS idx_affiliate_sales_order ON affiliate_sales(order_id)`
    },
    // 7. RLS policies
    {
      label: 'Enabling RLS on testimonials',
      sql: `ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY`
    },
    {
      label: 'Enabling RLS on affiliates',
      sql: `ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY`
    },
    {
      label: 'Enabling RLS on affiliate_sales',
      sql: `ALTER TABLE affiliate_sales ENABLE ROW LEVEL SECURITY`
    },
    // 8. Updated_at trigger function
    {
      label: 'Creating updated_at trigger function',
      sql: `CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql`
    },
    // 9. Triggers
    {
      label: 'Creating testimonials updated_at trigger',
      sql: `DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
        CREATE TRIGGER update_testimonials_updated_at
        BEFORE UPDATE ON testimonials
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()`
    },
    {
      label: 'Creating affiliates updated_at trigger',
      sql: `DROP TRIGGER IF EXISTS update_affiliates_updated_at ON affiliates;
        CREATE TRIGGER update_affiliates_updated_at
        BEFORE UPDATE ON affiliates
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()`
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const stmt of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: stmt.sql });
      
      if (error) {
        // Try using the REST SQL endpoint directly
        const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ sql: stmt.sql }),
        });
        
        if (!res.ok) {
          throw new Error(`RPC not available: ${error.message}`);
        }
      }
      
      console.log(`   ✅ ${stmt.label}`);
      passed++;
    } catch (err) {
      // If RPC doesn't work, that's expected — we'll use the management API
      console.log(`   ⚠️  ${stmt.label} — needs SQL Editor (RPC not available)`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} succeeded, ${failed} need manual SQL Editor`);
  
  if (failed > 0) {
    console.log('\n💡 To complete the migration:');
    console.log('   1. Go to https://supabase.com/dashboard/project/lyynavswxtzhsmwetgtn/sql/new');
    console.log('   2. Paste the contents of supabase/admin-features-migration.sql');
    console.log('   3. Click "Run"\n');
  }
  
  return { passed, failed };
}

// Alternative: try to verify tables exist by querying them
async function verifyTables() {
  console.log('\n🔍 Verifying table access...\n');
  
  const tables = ['testimonials', 'affiliates', 'affiliate_sales'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(0);
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: accessible`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: not found`);
    }
  }
}

async function main() {
  await runMigration();
  await verifyTables();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
