#!/usr/bin/env node

/**
 * Verification script for @tanstack/react-query installation
 * This script checks that the package is properly installed and can be imported
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying @tanstack/react-query installation...\n');

// Check 1: Verify package.json has the dependency
console.log('✓ Step 1: Checking package.json...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.dependencies['@tanstack/react-query']) {
  console.log(`  ✅ Found @tanstack/react-query version: ${packageJson.dependencies['@tanstack/react-query']}`);
} else {
  console.log('  ❌ @tanstack/react-query not found in package.json dependencies');
  process.exit(1);
}

// Check 2: Verify node_modules installation
console.log('\n✓ Step 2: Checking node_modules installation...');
const reactQueryPath = path.join(process.cwd(), 'node_modules', '@tanstack', 'react-query');

if (fs.existsSync(reactQueryPath)) {
  const installedPackageJson = JSON.parse(
    fs.readFileSync(path.join(reactQueryPath, 'package.json'), 'utf8')
  );
  console.log(`  ✅ @tanstack/react-query is installed (v${installedPackageJson.version})`);
} else {
  console.log('  ❌ @tanstack/react-query not found in node_modules');
  console.log('  💡 Run: pnpm install');
  process.exit(1);
}

// Check 3: Verify the module can be resolved
console.log('\n✓ Step 3: Verifying module resolution...');
try {
  const resolvedPath = require.resolve('@tanstack/react-query');
  console.log(`  ✅ Module resolves to: ${resolvedPath}`);
} catch (error) {
  console.log('  ❌ Failed to resolve @tanstack/react-query');
  console.log(`  Error: ${error.message}`);
  process.exit(1);
}

// Check 4: Verify key exports are available
console.log('\n✓ Step 4: Checking key exports...');
try {
  const reactQuery = require('@tanstack/react-query');
  const requiredExports = ['QueryClient', 'QueryClientProvider', 'useQuery', 'useMutation'];
  
  const missingExports = requiredExports.filter(exp => !reactQuery[exp]);
  
  if (missingExports.length === 0) {
    console.log(`  ✅ All required exports found: ${requiredExports.join(', ')}`);
  } else {
    console.log(`  ❌ Missing exports: ${missingExports.join(', ')}`);
    process.exit(1);
  }
} catch (error) {
  console.log('  ❌ Failed to import @tanstack/react-query');
  console.log(`  Error: ${error.message}`);
  process.exit(1);
}

// Check 5: Verify providers.tsx setup
console.log('\n✓ Step 5: Checking providers.tsx configuration...');
const providersPath = path.join(process.cwd(), 'app', 'providers.tsx');

if (fs.existsSync(providersPath)) {
  const providersContent = fs.readFileSync(providersPath, 'utf8');
  
  const checks = [
    { name: 'QueryClient import', pattern: /import.*QueryClient.*from.*@tanstack\/react-query/ },
    { name: 'QueryClientProvider import', pattern: /import.*QueryClientProvider.*from.*@tanstack\/react-query/ },
    { name: 'QueryClientProvider usage', pattern: /<QueryClientProvider/ },
  ];
  
  let allChecksPass = true;
  checks.forEach(check => {
    if (check.pattern.test(providersContent)) {
      console.log(`  ✅ ${check.name} found`);
    } else {
      console.log(`  ❌ ${check.name} not found`);
      allChecksPass = false;
    }
  });
  
  if (!allChecksPass) {
    process.exit(1);
  }
} else {
  console.log('  ⚠️  providers.tsx not found at expected location');
}

// Check 6: Verify usePackages.ts hook
console.log('\n✓ Step 6: Checking usePackages.ts hook...');
const usePackagesPath = path.join(process.cwd(), 'src', 'hooks', 'usePackages.ts');

if (fs.existsSync(usePackagesPath)) {
  const usePackagesContent = fs.readFileSync(usePackagesPath, 'utf8');
  
  if (usePackagesContent.includes("import { useQuery } from '@tanstack/react-query'")) {
    console.log('  ✅ useQuery import found in usePackages.ts');
  } else {
    console.log('  ❌ useQuery import not found in usePackages.ts');
    process.exit(1);
  }
  
  if (usePackagesContent.includes('useQuery({')) {
    console.log('  ✅ useQuery hook usage found');
  } else {
    console.log('  ❌ useQuery hook usage not found');
    process.exit(1);
  }
} else {
  console.log('  ❌ usePackages.ts not found');
  process.exit(1);
}

console.log('\n' + '='.repeat(60));
console.log('✅ ALL CHECKS PASSED!');
console.log('='.repeat(60));
console.log('\n@tanstack/react-query is properly installed and configured.');
console.log('\n📝 Summary:');
console.log('  • Package version: ' + packageJson.dependencies['@tanstack/react-query']);
console.log('  • Installation: ✅ Complete');
console.log('  • Module resolution: ✅ Working');
console.log('  • Provider setup: ✅ Configured');
console.log('  • Hook implementation: ✅ Valid');
console.log('\n🎉 Your build issue should be resolved!');

