#!/usr/bin/env node

// Simple diagnostic script to check the frontend state
const fs = require('fs');
const path = require('path');

console.log('🔍 Frontend Diagnostic Check\n');

// Check if key files exist
const filesToCheck = [
  'src/components/pages/ProductEssential.tsx',
  'src/hooks/usePackages.ts',
  'app/products/total-essential/page.tsx',
  'src/components/ui/package-selector.tsx'
];

filesToCheck.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath}: Exists`);
  } else {
    console.log(`❌ ${filePath}: Missing`);
  }
});

// Check if environment variables are loaded
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('\n✅ .env.local: Exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasStripeKey = envContent.includes('STRIPE_SECRET_KEY');
  
  console.log(`  - Supabase URL: ${hasSupabaseUrl ? '✅ Configured' : '❌ Missing'}`);
  console.log(`  - Stripe Key: ${hasStripeKey ? '✅ Configured' : '❌ Missing'}`);
} else {
  console.log('\n❌ .env.local: Missing');
}

// Check if package.json has required scripts
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};
  
  console.log('\n📦 Available Scripts:');
  Object.entries(scripts).forEach(([script, command]) => {
    console.log(`  - ${script}: ${command}`);
  });
}

// Check node modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('\n✅ node_modules: Exists');
} else {
  console.log('\n❌ node_modules: Missing - Run "npm install" or "pnpm install"');
}

console.log('\n🎯 Next Steps:');
console.log('1. Run the development server: pnpm dev');
console.log('2. Check browser console for errors');
console.log('3. Look for console logs from usePackages hook');
console.log('4. Check if packages are being loaded correctly');
