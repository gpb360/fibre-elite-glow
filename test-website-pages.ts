import { chromium } from 'playwright';

// Define all the pages to test
const PAGES_TO_TEST = [
  { name: 'Home', url: 'http://localhost:3002', path: '/' },
  { name: 'About', url: 'http://localhost:3002/about', path: '/about' },
  { name: 'Products', url: 'http://localhost:3002/products', path: '/products' },
  { name: 'Total Essential', url: 'http://localhost:3002/products/total-essential', path: '/products/total-essential' },
  { name: 'Total Essential Plus', url: 'http://localhost:3002/products/total-essential-plus', path: '/products/total-essential-plus' },
  
  // Ingredient pages
  { name: 'Apple Fiber', url: 'http://localhost:3002/ingredients/apple-fiber', path: '/ingredients/apple-fiber' },
  { name: 'Beta Glucan Oat Bran', url: 'http://localhost:3002/ingredients/beta-glucan-oat-bran', path: '/ingredients/beta-glucan-oat-bran' },
  { name: 'Antioxidant Parsley', url: 'http://localhost:3002/ingredients/antioxidant-parsley', path: '/ingredients/antioxidant-parsley' },
  { name: 'Nutrient Rich Carrot', url: 'http://localhost:3002/ingredients/nutrient-rich-carrot', path: '/ingredients/nutrient-rich-carrot' },
  { name: 'Hydrating Celery', url: 'http://localhost:3002/ingredients/hydrating-celery', path: '/ingredients/hydrating-celery' },
  { name: 'Cranberry', url: 'http://localhost:3002/ingredients/cranberry', path: '/ingredients/cranberry' },
  { name: 'Enzyme Rich Papaya', url: 'http://localhost:3002/ingredients/enzyme-rich-papaya', path: '/ingredients/enzyme-rich-papaya' },
  { name: 'Raspberry', url: 'http://localhost:3002/ingredients/raspberry', path: '/ingredients/raspberry' },
  { name: 'Strawberry', url: 'http://localhost:3002/ingredients/strawberry', path: '/ingredients/strawberry' },
  { name: 'Soothing Aloe Vera Powder', url: 'http://localhost:3002/ingredients/soothing-aloe-vera-powder', path: '/ingredients/soothing-aloe-vera-powder' },
  { name: 'Fresh Spinach Powder', url: 'http://localhost:3002/ingredients/fresh-spinach-powder', path: '/ingredients/fresh-spinach-powder' },
  { name: 'Acai Berry', url: 'http://localhost:3002/ingredients/acai-berry', path: '/ingredients/acai-berry' },
  { name: 'Soluble Corn Fiber', url: 'http://localhost:3002/ingredients/soluble-corn-fiber', path: '/ingredients/soluble-corn-fiber' },
  { name: 'Digestive Aid Guar Gum', url: 'http://localhost:3002/ingredients/digestive-aid-guar-gum', path: '/ingredients/digestive-aid-guar-gum' },
  { name: 'Sustainable Palm Fiber', url: 'http://localhost:3002/ingredients/sustainable-palm-fiber', path: '/ingredients/sustainable-palm-fiber' },
  { name: 'Prebiotic Powerhouse', url: 'http://localhost:3002/ingredients/prebiotic-powerhouse', path: '/ingredients/prebiotic-powerhouse' },
  { name: 'Premium Apple Fiber', url: 'http://localhost:3002/ingredients/premium-apple-fiber', path: '/ingredients/premium-apple-fiber' }
];

interface TestResult {
  name: string;
  path: string;
  status: 'SUCCESS' | 'ERROR';
  statusCode?: number;
  error?: string;
  consoleErrors: string[];
  networkErrors: string[];
  loadTime: number;
}

async function testPage(page: any, testPage: any): Promise<TestResult> {
  const startTime = Date.now();
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];
  
  // Listen for console errors
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Listen for network failures
  page.on('response', (response: any) => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()} - ${response.url()}`);
    }
  });

  try {
    console.log(`🧪 Testing: ${testPage.name} (${testPage.path})`);
    
    // Navigate to the page
    const response = await page.goto(testPage.url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    const loadTime = Date.now() - startTime;
    const statusCode = response?.status();
    
    // Wait for the page to be fully rendered
    await page.waitForTimeout(1000);
    
    // Check if the page loaded successfully
    if (statusCode && statusCode >= 400) {
      return {
        name: testPage.name,
        path: testPage.path,
        status: 'ERROR',
        statusCode,
        error: `HTTP ${statusCode}`,
        consoleErrors,
        networkErrors,
        loadTime
      };
    }
    
    // Check for React/Next.js errors in the page
    const hasReactError = await page.evaluate(() => {
      return document.body.innerHTML.includes('Application error') || 
             document.body.innerHTML.includes('Internal Server Error') ||
             document.body.innerHTML.includes('This page could not be found');
    });
    
    if (hasReactError) {
      return {
        name: testPage.name,
        path: testPage.path,
        status: 'ERROR',
        statusCode,
        error: 'React/Next.js application error detected',
        consoleErrors,
        networkErrors,
        loadTime
      };
    }
    
    console.log(`✅ ${testPage.name} - Loaded successfully (${loadTime}ms)`);
    
    return {
      name: testPage.name,
      path: testPage.path,
      status: 'SUCCESS',
      statusCode,
      consoleErrors,
      networkErrors,
      loadTime
    };
    
  } catch (error: any) {
    const loadTime = Date.now() - startTime;
    console.log(`❌ ${testPage.name} - Failed: ${error.message}`);
    
    return {
      name: testPage.name,
      path: testPage.path,
      status: 'ERROR',
      error: error.message,
      consoleErrors,
      networkErrors,
      loadTime
    };
  }
}

async function testAllPages(): Promise<void> {
  console.log('🚀 Starting Website Page Testing');
  console.log(`📊 Found ${PAGES_TO_TEST.length} pages to test\n`);
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results: TestResult[] = [];
  
  // Test each page
  for (const testPageData of PAGES_TO_TEST) {
    const result = await testPage(page, testPageData);
    results.push(result);
    
    // Add a small delay between tests
    await page.waitForTimeout(500);
  }
  
  await browser.close();
  
  // Generate report
  console.log('\n📊 WEBSITE TESTING REPORT');
  console.log('=' .repeat(50));
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`✅ Successful: ${successCount}/${results.length}`);
  console.log(`❌ Errors: ${errorCount}/${results.length}`);
  console.log('');
  
  // Show successful pages
  console.log('✅ SUCCESSFUL PAGES:');
  results
    .filter(r => r.status === 'SUCCESS')
    .forEach(r => {
      const warnings = [];
      if (r.consoleErrors.length > 0) warnings.push(`${r.consoleErrors.length} console errors`);
      if (r.networkErrors.length > 0) warnings.push(`${r.networkErrors.length} network errors`);
      
      const warningStr = warnings.length > 0 ? ` (⚠️  ${warnings.join(', ')})` : '';
      console.log(`  ${r.name} - ${r.loadTime}ms${warningStr}`);
    });
  
  // Show error pages with details
  if (errorCount > 0) {
    console.log('\n❌ PAGES WITH ERRORS:');
    results
      .filter(r => r.status === 'ERROR')
      .forEach(r => {
        console.log(`  ${r.name} (${r.path})`);
        console.log(`    Status: ${r.statusCode || 'N/A'}`);
        console.log(`    Error: ${r.error || 'Unknown error'}`);
        
        if (r.consoleErrors.length > 0) {
          console.log(`    Console Errors:`);
          r.consoleErrors.slice(0, 3).forEach(err => console.log(`      - ${err}`));
        }
        
        if (r.networkErrors.length > 0) {
          console.log(`    Network Errors:`);
          r.networkErrors.slice(0, 3).forEach(err => console.log(`      - ${err}`));
        }
        console.log('');
      });
  }
  
  // Show pages with warnings
  const pagesWithWarnings = results.filter(r => 
    r.status === 'SUCCESS' && (r.consoleErrors.length > 0 || r.networkErrors.length > 0)
  );
  
  if (pagesWithWarnings.length > 0) {
    console.log('⚠️  PAGES WITH WARNINGS:');
    pagesWithWarnings.forEach(r => {
      console.log(`  ${r.name} (${r.path})`);
      if (r.consoleErrors.length > 0) {
        console.log(`    Console Errors (${r.consoleErrors.length}):`);
        r.consoleErrors.slice(0, 2).forEach(err => console.log(`      - ${err}`));
      }
      if (r.networkErrors.length > 0) {
        console.log(`    Network Errors (${r.networkErrors.length}):`);
        r.networkErrors.slice(0, 2).forEach(err => console.log(`      - ${err}`));
      }
      console.log('');
    });
  }
  
  console.log('🎉 Website testing complete!');
}

// Run the tests
testAllPages().catch(console.error);