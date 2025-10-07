#!/usr/bin/env node

/**
 * Validation script for performance fixes
 * Checks that all optimizations are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Performance Fixes...\n');

let hasErrors = false;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
  hasErrors = true;
}

function warning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Check 1: Validate middleware.ts CSP configuration
console.log('1️⃣  Checking middleware.ts CSP configuration...');
try {
  const middlewarePath = path.join(process.cwd(), 'middleware.ts');
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  const requiredCSPDirectives = [
    'frame-src.*netlify',
    'font-src.*fonts.gstatic.com.*data:',
    'script-src.*google-analytics',
    'connect-src.*google-analytics',
  ];
  
  let allDirectivesFound = true;
  requiredCSPDirectives.forEach(directive => {
    const regex = new RegExp(directive, 'i');
    if (!regex.test(middlewareContent)) {
      error(`Missing CSP directive: ${directive}`);
      allDirectivesFound = false;
    }
  });
  
  if (allDirectivesFound) {
    success('All required CSP directives found in middleware.ts');
  }
} catch (err) {
  error(`Failed to read middleware.ts: ${err.message}`);
}

// Check 2: Validate netlify.toml headers
console.log('\n2️⃣  Checking netlify.toml headers...');
try {
  const netlifyTomlPath = path.join(process.cwd(), 'netlify.toml');
  const netlifyContent = fs.readFileSync(netlifyTomlPath, 'utf8');
  
  const requiredHeaders = [
    { pattern: /for = "\*\.woff2"/, name: 'WOFF2 font caching' },
    { pattern: /for = "\*\.webp"/, name: 'WebP image caching' },
    { pattern: /Content-Security-Policy/, name: 'CSP header' },
    { pattern: /X-Frame-Options.*SAMEORIGIN/, name: 'X-Frame-Options' },
    { pattern: /Strict-Transport-Security/, name: 'HSTS header' },
  ];
  
  requiredHeaders.forEach(({ pattern, name }) => {
    if (pattern.test(netlifyContent)) {
      success(`${name} configured`);
    } else {
      error(`Missing ${name} in netlify.toml`);
    }
  });
} catch (err) {
  error(`Failed to read netlify.toml: ${err.message}`);
}

// Check 3: Validate layout.tsx font configuration
console.log('\n3️⃣  Checking layout.tsx font configuration...');
try {
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const fontChecks = [
    { pattern: /display:\s*['"]swap['"]/, name: 'Font display swap' },
    { pattern: /preload:\s*true/, name: 'Font preload' },
    { pattern: /fallback:\s*\[/, name: 'Font fallback' },
    { pattern: /adjustFontFallback:\s*true/, name: 'Adjust font fallback' },
    { pattern: /rel="preconnect".*fonts\.googleapis\.com/, name: 'Google Fonts preconnect' },
    { pattern: /rel="dns-prefetch".*google-analytics/, name: 'Analytics DNS prefetch' },
  ];
  
  fontChecks.forEach(({ pattern, name }) => {
    if (pattern.test(layoutContent)) {
      success(`${name} configured`);
    } else {
      warning(`${name} not found (may be optional)`);
    }
  });
} catch (err) {
  error(`Failed to read layout.tsx: ${err.message}`);
}

// Check 4: Validate next.config.js image optimization
console.log('\n4️⃣  Checking next.config.js image optimization...');
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  const imageChecks = [
    { pattern: /formats:\s*\[['"]image\/webp['"]/, name: 'WebP format support' },
    { pattern: /formats:.*['"]image\/avif['"]/, name: 'AVIF format support' },
    { pattern: /deviceSizes:\s*\[/, name: 'Device sizes configuration' },
    { pattern: /imageSizes:\s*\[/, name: 'Image sizes configuration' },
    { pattern: /minimumCacheTTL/, name: 'Image cache TTL' },
  ];
  
  imageChecks.forEach(({ pattern, name }) => {
    if (pattern.test(nextConfigContent)) {
      success(`${name} configured`);
    } else {
      warning(`${name} not found`);
    }
  });
} catch (err) {
  error(`Failed to read next.config.js: ${err.message}`);
}

// Check 5: Verify no local font files exist
console.log('\n5️⃣  Checking for local font files (should not exist)...');
try {
  const publicPath = path.join(process.cwd(), 'public');
  const fontsPath = path.join(publicPath, 'fonts');
  
  if (fs.existsSync(fontsPath)) {
    const fontFiles = fs.readdirSync(fontsPath);
    if (fontFiles.length > 0) {
      warning(`Found ${fontFiles.length} font files in public/fonts - consider removing if using next/font`);
      fontFiles.forEach(file => {
        info(`  - ${file}`);
      });
    } else {
      success('No local font files found (using next/font/google)');
    }
  } else {
    success('No fonts directory found (using next/font/google)');
  }
} catch (err) {
  warning(`Could not check for local fonts: ${err.message}`);
}

// Check 6: Validate critical resources exist
console.log('\n6️⃣  Checking critical resources...');
try {
  const heroImagePath = path.join(
    process.cwd(),
    'public',
    'lovable-uploads',
    'webp',
    '27ca3fa0-24aa-479b-b075-3f11006467c5.webp'
  );
  
  if (fs.existsSync(heroImagePath)) {
    success('Hero image (LCP candidate) exists');
  } else {
    warning('Hero image not found - may affect LCP score');
  }
} catch (err) {
  warning(`Could not verify hero image: ${err.message}`);
}

// Check 7: Validate performance monitoring scripts
console.log('\n7️⃣  Checking performance monitoring setup...');
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const perfScripts = [
    'perf:audit',
    'perf:build',
    'analyze',
  ];
  
  perfScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      success(`Performance script "${script}" configured`);
    } else {
      warning(`Performance script "${script}" not found`);
    }
  });
} catch (err) {
  warning(`Could not check package.json scripts: ${err.message}`);
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log(`${colors.red}❌ Validation completed with errors${colors.reset}`);
  console.log('Please fix the errors above before deploying.');
  process.exit(1);
} else {
  console.log(`${colors.green}✅ All validations passed!${colors.reset}`);
  console.log('\nYour performance optimizations are properly configured.');
  console.log('\nNext steps:');
  console.log('1. Commit and push changes to trigger deployment');
  console.log('2. Run Lighthouse audit on deployed site');
  console.log('3. Verify no console errors or CSP violations');
  console.log('4. Monitor Core Web Vitals in production');
  process.exit(0);
}

