#!/usr/bin/env node
/**
 * Route Verification Script
 * 
 * This script tests all routes in the application to ensure they:
 * 1. Return 200 status codes
 * 2. Don't contain 404 content
 * 3. Load expected page content
 * 
 * Usage:
 *   node scripts/verify-routes.js [--ci] [--base-url=https://example.com]
 * 
 * Options:
 *   --ci         Run in CI mode (exit with error code on failures)
 *   --base-url   Base URL to test against (default: http://localhost:3000)
 *   --verbose    Show detailed logs for each route
 *   --json       Output results as JSON
 *   --timeout    Request timeout in ms (default: 10000)
 *   --parallel   Max parallel requests (default: 5)
 */

const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const chalk = require('chalk');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg === '--ci') {
    acc.ci = true;
  } else if (arg === '--verbose') {
    acc.verbose = true;
  } else if (arg === '--json') {
    acc.json = true;
  } else if (arg.startsWith('--base-url=')) {
    acc.baseUrl = arg.split('=')[1];
  } else if (arg.startsWith('--timeout=')) {
    acc.timeout = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--parallel=')) {
    acc.parallel = parseInt(arg.split('=')[1], 10);
  }
  return acc;
}, {
  ci: false,
  verbose: false,
  json: false,
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
  parallel: 5
});

// Define all expected routes in the application
const ROUTES = [
  // Main routes
  { path: '/', expectedContent: 'La Belle Vie' },
  { path: '/products', expectedContent: 'Products' },
  { path: '/products/total-essential', expectedContent: 'Total Essential' },
  { path: '/products/total-essential-plus', expectedContent: 'Total Essential Plus' },
  { path: '/benefits', expectedContent: 'Benefits' },
  { path: '/testimonials', expectedContent: 'Testimonials' },
  { path: '/faq', expectedContent: 'FAQ' },
  { path: '/cart', expectedContent: 'Cart' },
  { path: '/checkout', expectedContent: 'Checkout' },
  
  // Ingredient routes
  { path: '/ingredients', expectedContent: 'Ingredients' },
  { path: '/ingredients/acai-berry', expectedContent: 'Acai Berry' },
  { path: '/ingredients/antioxidant-parsley', expectedContent: 'Antioxidant Parsley' },
  { path: '/ingredients/apple-fiber', expectedContent: 'Apple Fiber' },
  { path: '/ingredients/beta-glucan-oat-bran', expectedContent: 'Beta Glucan Oat Bran' },
  { path: '/ingredients/cranberry', expectedContent: 'Cranberry' },
  { path: '/ingredients/detoxifying-broccoli-extract', expectedContent: 'Detoxifying Broccoli Extract' },
  { path: '/ingredients/digestive-aid-guar-gum', expectedContent: 'Digestive Aid Guar Gum' },
  { path: '/ingredients/enzyme-rich-papaya', expectedContent: 'Enzyme Rich Papaya' },
  { path: '/ingredients/fresh-cabbage-extract', expectedContent: 'Fresh Cabbage Extract' },
  { path: '/ingredients/fresh-spinach-powder', expectedContent: 'Fresh Spinach Powder' },
  { path: '/ingredients/hydrating-celery', expectedContent: 'Hydrating Celery' },
  { path: '/ingredients/nutrient-rich-carrot', expectedContent: 'Nutrient Rich Carrot' },
  { path: '/ingredients/prebiotic-powerhouse', expectedContent: 'Prebiotic Powerhouse' },
  { path: '/ingredients/premium-apple-fiber', expectedContent: 'Premium Apple Fiber' },
  { path: '/ingredients/raspberry', expectedContent: 'Raspberry' },
  { path: '/ingredients/soluble-corn-fiber', expectedContent: 'Soluble Corn Fiber' },
  { path: '/ingredients/soothing-aloe-vera-powder', expectedContent: 'Soothing Aloe Vera Powder' },
  { path: '/ingredients/strawberry', expectedContent: 'Strawberry' },
  { path: '/ingredients/sustainable-palm-fiber', expectedContent: 'Sustainable Palm Fiber' },
  
  // These routes should 404 (we'll verify they use our custom 404 page)
  { path: '/nonexistent-page', expectedContent: '404', shouldBe404: true },
  { path: '/products/nonexistent-product', expectedContent: '404', shouldBe404: true },
];

// Add routes from app directory (if running locally)
try {
  const appDir = path.join(process.cwd(), 'app');
  if (fs.existsSync(appDir)) {
    const findPageFiles = (dir, basePath = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      entries.forEach(entry => {
        const currentPath = path.join(dir, entry.name);
        const routePath = path.join(basePath, entry.name);
        
        if (entry.isDirectory()) {
          // Skip special Next.js directories
          if (!['api', '_next', 'node_modules'].includes(entry.name) && !entry.name.startsWith('_')) {
            findPageFiles(currentPath, path.join(basePath, entry.name));
          }
        } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'page.js') {
          // Convert file path to URL path
          let urlPath = basePath.replace(/\\/g, '/');
          
          // Skip already defined routes and special pages
          const existingRoute = ROUTES.find(r => r.path === '/' + urlPath);
          if (!existingRoute && !urlPath.includes('not-found') && !urlPath.includes('error')) {
            ROUTES.push({
              path: '/' + urlPath,
              expectedContent: urlPath.split('/').pop() || 'Home',
              autoDetected: true
            });
          }
        }
      });
    };
    
    findPageFiles(appDir);
  }
} catch (err) {
  console.error('Error auto-detecting routes:', err.message);
}

// Results storage
const results = {
  passed: [],
  failed: [],
  skipped: [],
  total: ROUTES.length,
  startTime: Date.now()
};

/**
 * Test a single route
 * @param {Object} route Route object with path and expectedContent
 * @returns {Promise<Object>} Test result object
 */
async function testRoute(route) {
  const url = new URL(route.path, args.baseUrl);
  const startTime = Date.now();
  
  try {
    // Make the request
    const response = await fetch(url, {
      timeout: args.timeout,
      headers: {
        'User-Agent': 'RouteVerifier/1.0'
      },
      redirect: 'follow'
    });
    
    const html = await response.text();
    const status = response.status;
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Get page title and check for 404 content
    const title = document.title;
    const hasExpectedContent = route.expectedContent ? 
      html.includes(route.expectedContent) : 
      true;
    const has404Content = html.includes('404') && 
      (html.includes('Page not found') || html.includes('page not found'));
    
    // Determine if the test passed
    let passed = false;
    let reason = '';
    
    if (route.shouldBe404) {
      // For routes that should 404, we expect our custom 404 page
      passed = has404Content && status >= 200 && status < 500;
      if (!passed) reason = 'Expected 404 page not found';
    } else {
      // For normal routes, we expect 200 status and no 404 content
      passed = status === 200 && hasExpectedContent && !has404Content;
      if (status !== 200) reason = `Unexpected status code: ${status}`;
      else if (!hasExpectedContent) reason = `Expected content "${route.expectedContent}" not found`;
      else if (has404Content) reason = 'Page contains 404 content';
    }
    
    // Create result object
    const result = {
      route: route.path,
      status,
      passed,
      reason: passed ? '' : reason,
      duration: Date.now() - startTime,
      title,
      autoDetected: route.autoDetected || false
    };
    
    // Log result if in verbose mode
    if (args.verbose) {
      const icon = passed ? '✅' : '❌';
      const statusColor = status === 200 ? 'green' : (status >= 400 ? 'red' : 'yellow');
      console.log(
        `${icon} ${route.path.padEnd(40)} ` +
        `[${chalk[statusColor](status)}] ` +
        `${passed ? chalk.green('PASS') : chalk.red('FAIL')} ` +
        `${result.duration}ms` +
        (result.reason ? ` - ${result.reason}` : '')
      );
    }
    
    return result;
  } catch (error) {
    // Handle fetch errors
    const result = {
      route: route.path,
      status: 0,
      passed: false,
      reason: `Request failed: ${error.message}`,
      duration: Date.now() - startTime,
      error: true
    };
    
    if (args.verbose) {
      console.log(`❌ ${route.path.padEnd(40)} [ERROR] ${chalk.red('FAIL')} - ${error.message}`);
    }
    
    return result;
  }
}

/**
 * Run tests in parallel with a concurrency limit
 * @param {Array} items Items to process
 * @param {Function} fn Processing function
 * @param {Number} concurrency Max concurrent operations
 * @returns {Promise<Array>} Results array
 */
async function runWithConcurrencyLimit(items, fn, concurrency) {
  const results = [];
  const running = [];
  const enqueue = items.slice();
  
  // Process next item in the queue
  async function next() {
    if (enqueue.length) {
      const item = enqueue.shift();
      running.push(item);
      
      try {
        const result = await fn(item);
        results.push(result);
      } catch (err) {
        results.push({
          route: item.path,
          status: 0,
          passed: false,
          reason: `Uncaught error: ${err.message}`,
          error: true
        });
      }
      
      const index = running.indexOf(item);
      if (index !== -1) running.splice(index, 1);
      
      // Process next item
      return next();
    }
  }
  
  // Start initial batch of tasks
  const initialBatch = Math.min(concurrency, items.length);
  const promises = Array(initialBatch).fill().map(() => next());
  
  // Wait for all tasks to complete
  await Promise.all(promises);
  return results;
}

/**
 * Generate a report of the test results
 * @param {Object} results Test results
 */
function generateReport(results) {
  const duration = Date.now() - results.startTime;
  const passRate = Math.round((results.passed.length / results.total) * 100);
  
  if (args.json) {
    // Output JSON report
    console.log(JSON.stringify({
      summary: {
        total: results.total,
        passed: results.passed.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
        passRate: `${passRate}%`,
        duration: `${duration}ms`
      },
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped
    }, null, 2));
    return;
  }
  
  // Output text report
  console.log('\n=== Route Verification Report ===');
  console.log(`Total routes: ${results.total}`);
  console.log(`Passed: ${chalk.green(results.passed.length)}`);
  console.log(`Failed: ${chalk.red(results.failed.length)}`);
  if (results.skipped.length) console.log(`Skipped: ${chalk.yellow(results.skipped.length)}`);
  console.log(`Pass rate: ${passRate >= 90 ? chalk.green(`${passRate}%`) : chalk.yellow(`${passRate}%`)}`);
  console.log(`Duration: ${duration}ms`);
  
  // Show failed routes
  if (results.failed.length > 0) {
    console.log('\nFailed routes:');
    results.failed.forEach(result => {
      console.log(`  ${chalk.red('✘')} ${result.route}`);
      console.log(`    Status: ${result.status}`);
      console.log(`    Reason: ${result.reason}`);
    });
  }
  
  // Show success message if all passed
  if (results.failed.length === 0) {
    console.log(chalk.green('\n✓ All routes verified successfully!'));
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`🔍 Verifying ${ROUTES.length} routes against ${args.baseUrl}`);
  console.log(`Running with concurrency: ${args.parallel}, timeout: ${args.timeout}ms`);
  
  try {
    // Test all routes with concurrency limit
    const testResults = await runWithConcurrencyLimit(
      ROUTES,
      testRoute,
      args.parallel
    );
    
    // Categorize results
    testResults.forEach(result => {
      if (result.passed) {
        results.passed.push(result);
      } else {
        results.failed.push(result);
      }
    });
    
    // Generate report
    generateReport(results);
    
    // Exit with appropriate code for CI
    if (args.ci && results.failed.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`Error running tests: ${error.message}`));
    if (args.ci) {
      process.exit(1);
    }
  }
}

// Run the script
main();
