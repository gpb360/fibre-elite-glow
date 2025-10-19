#!/usr/bin/env node

/**
 * Checkout Test Runner
 * 
 * This script provides an easy way to run the Stripe checkout tests
 * with proper setup and configuration.
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${colors.bright}${colors.blue}🧪 ${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logInfo(message) {
  log(`${colors.cyan}ℹ️  ${message}${colors.reset}`);
}

async function checkPrerequisites() {
  logHeader('Checking Prerequisites');

  // Check if Playwright is installed
  if (!existsSync('node_modules/@playwright/test')) {
    logError('Playwright is not installed. Run: npm install');
    return false;
  }
  logSuccess('Playwright is installed');

  // Check if browsers are installed
  try {
    await runCommand('npx', ['playwright', '--version'], { silent: true });
    logSuccess('Playwright browsers are available');
  } catch (error) {
    logWarning('Playwright browsers may not be installed. Run: npx playwright install');
  }

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY'
  ];

  let envVarsOk = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      logError(`Missing environment variable: ${envVar}`);
      envVarsOk = false;
    }
  }

  if (envVarsOk) {
    logSuccess('Environment variables are configured');
  } else {
    logError('Please configure required environment variables in .env.local');
    return false;
  }

  // Check if using test keys
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && !stripeKey.startsWith('sk_test_')) {
    logWarning('You are using live Stripe keys. Consider using test keys for testing.');
  } else {
    logSuccess('Using Stripe test keys');
  }

  return true;
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.silent ? 'pipe' : 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function runTests(testType = 'all', options = {}) {
  logHeader(`Running ${testType} tests`);

  const playwrightArgs = ['playwright', 'test'];

  // Add test file patterns based on type
  switch (testType) {
    case 'positive':
      playwrightArgs.push('checkout-positive');
      break;
    case 'negative':
      playwrightArgs.push('checkout-negative');
      break;
    case 'e2e':
      playwrightArgs.push('full-checkout-flow');
      break;
    case 'all':
      // Run all tests
      break;
    default:
      playwrightArgs.push(testType); // Custom pattern
  }

  // Add options
  if (options.headed) {
    playwrightArgs.push('--headed');
  }

  if (options.ui) {
    playwrightArgs.push('--ui');
  }

  if (options.debug) {
    playwrightArgs.push('--debug');
  }

  if (options.browser) {
    playwrightArgs.push('--project', options.browser);
  }

  if (options.workers) {
    playwrightArgs.push('--workers', options.workers.toString());
  }

  try {
    await runCommand('npx', playwrightArgs);
    logSuccess('Tests completed successfully');
  } catch (error) {
    logError('Tests failed');
    throw error;
  }
}

async function generateReport() {
  logHeader('Generating Test Report');
  
  try {
    await runCommand('npx', ['playwright', 'show-report'], { silent: true });
    logSuccess('Test report generated');
    logInfo('Open http://localhost:9323 to view the report');
  } catch (error) {
    logWarning('Could not generate report automatically');
    logInfo('Run: npx playwright show-report');
  }
}

function printUsage() {
  log(`
${colors.bright}La Belle Vie - Checkout Test Runner${colors.reset}

${colors.bright}Usage:${colors.reset}
  node scripts/run-checkout-tests.js [test-type] [options]

${colors.bright}Test Types:${colors.reset}
  all         Run all checkout tests (default)
  positive    Run positive checkout scenarios
  negative    Run negative/error scenarios  
  e2e         Run full end-to-end flows
  [pattern]   Run tests matching custom pattern

${colors.bright}Options:${colors.reset}
  --headed    Run tests in headed mode (visible browser)
  --ui        Run tests with Playwright UI
  --debug     Run tests in debug mode
  --browser   Specify browser (chromium, firefox, webkit)
  --workers   Number of parallel workers
  --report    Generate and show test report
  --help      Show this help message

${colors.bright}Examples:${colors.reset}
  node scripts/run-checkout-tests.js
  node scripts/run-checkout-tests.js positive --headed
  node scripts/run-checkout-tests.js negative --browser firefox
  node scripts/run-checkout-tests.js e2e --ui
  node scripts/run-checkout-tests.js --report

${colors.bright}Environment Setup:${colors.reset}
  1. Copy .env.test to .env.local
  2. Add your Stripe test keys
  3. Start the application: npm run dev
  4. Run tests: node scripts/run-checkout-tests.js
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    return;
  }

  // Parse arguments
  const testType = args.find(arg => !arg.startsWith('--')) || 'all';
  const options = {
    headed: args.includes('--headed'),
    ui: args.includes('--ui'),
    debug: args.includes('--debug'),
    browser: args.find(arg => arg.startsWith('--browser'))?.split('=')[1],
    workers: parseInt(args.find(arg => arg.startsWith('--workers'))?.split('=')[1] || '1'),
    report: args.includes('--report')
  };

  try {
    logHeader('La Belle Vie - Checkout Test Suite');
    
    if (options.report) {
      await generateReport();
      return;
    }

    // Check prerequisites
    const prereqsOk = await checkPrerequisites();
    if (!prereqsOk) {
      process.exit(1);
    }

    // Run tests
    await runTests(testType, options);

    // Generate report if tests passed
    logInfo('Tests completed. Generating report...');
    setTimeout(() => {
      generateReport().catch(() => {
        logInfo('Run "npx playwright show-report" to view detailed results');
      });
    }, 1000);

  } catch (error) {
    logError(`Test execution failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n\nTest execution interrupted');
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('\n\nTest execution terminated');
  process.exit(1);
});

// Run the script
main().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});
