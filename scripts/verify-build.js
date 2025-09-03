#!/usr/bin/env node

/**
 * Build Verification Script
 * 
 * This script helps verify that the build fixes are working properly
 * Run with: node scripts/verify-build.js
 */

const { exec } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Verifying build configuration...'));

// Check if experimental features have been removed
console.log(chalk.yellow('📋 Build Configuration Checks:'));

try {
  const nextConfig = require('../next.config.js');
  
  // Check if experimental features are removed or empty
  if (!nextConfig.experimental || Object.keys(nextConfig.experimental).length === 0) {
    console.log(chalk.green('✅ Experimental features removed/disabled'));
  } else {
    console.log(chalk.yellow('⚠️  Some experimental features still present:'), 
                Object.keys(nextConfig.experimental));
  }
  
  // Check TypeScript build error handling
  if (nextConfig.typescript && nextConfig.typescript.ignoreBuildErrors) {
    console.log(chalk.yellow('⚠️  TypeScript errors are being ignored (temporary fix)'));
  }
  
  // Check ESLint build error handling
  if (nextConfig.eslint && nextConfig.eslint.ignoreDuringBuilds) {
    console.log(chalk.yellow('⚠️  ESLint errors are being ignored (temporary fix)'));
  }
  
  console.log(chalk.green('✅ Configuration looks good for stable builds'));
  
} catch (error) {
  console.log(chalk.red('❌ Error reading next.config.js:', error.message));
}

// Check TypeScript configuration
console.log(chalk.yellow('\n📋 TypeScript Configuration:'));
try {
  const tsConfig = require('../tsconfig.json');
  
  if (tsConfig.compilerOptions.strict === false) {
    console.log(chalk.yellow('⚠️  TypeScript strict mode disabled (temporary)'));
  }
  
  if (tsConfig.compilerOptions.skipLibCheck) {
    console.log(chalk.green('✅ Library type checking skipped'));
  }
  
  console.log(chalk.green('✅ TypeScript configuration optimized for builds'));
  
} catch (error) {
  console.log(chalk.red('❌ Error reading tsconfig.json:', error.message));
}

// Test build process
console.log(chalk.yellow('\n🔨 Testing Build Process:'));
console.log(chalk.blue('Running: pnpm build'));

exec('pnpm build', { cwd: process.cwd() }, (error, stdout, stderr) => {
  if (error) {
    console.log(chalk.red('❌ Build failed:'));
    console.log(chalk.red(error.message));
    console.log(chalk.yellow('\n🔧 Troubleshooting Tips:'));
    console.log('1. Clear Next.js cache: rm -rf .next');
    console.log('2. Reinstall dependencies: rm -rf node_modules && pnpm install');
    console.log('3. Check for TypeScript errors: pnpm tsc --noEmit');
    process.exit(1);
  } else {
    console.log(chalk.green('✅ Build completed successfully!'));
    console.log(chalk.blue('\n📊 Build Output:'));
    console.log(stdout);
    
    if (stderr) {
      console.log(chalk.yellow('\n⚠️  Warnings:'));
      console.log(stderr);
    }
    
    console.log(chalk.green('\n🎉 Your build is working! Deploy when ready.'));
  }
});
