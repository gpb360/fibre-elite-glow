import { Page, expect } from '@playwright/test';
import { TIMEOUTS } from './test-data';

/**
 * Test helper utilities for common operations
 */

/**
 * Wait for network to be idle and page to be fully loaded
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Take a screenshot with timestamp for debugging
 */
export async function takeTimestampedScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Wait for element to be visible with custom timeout
 */
export async function waitForElement(
  page: Page, 
  selector: string, 
  timeout: number = TIMEOUTS.NAVIGATION
): Promise<void> {
  await page.waitForSelector(selector, { 
    state: 'visible', 
    timeout 
  });
}

/**
 * Scroll element into view and click
 */
export async function scrollAndClick(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await element.click();
}

/**
 * Fill form field with validation
 */
export async function fillFormField(
  page: Page, 
  selector: string, 
  value: string,
  validate: boolean = true
): Promise<void> {
  const field = page.locator(selector);
  await field.fill(value);
  
  if (validate) {
    await expect(field).toHaveValue(value);
  }
}

/**
 * Wait for Stripe elements to load
 */
export async function waitForStripeElements(page: Page): Promise<void> {
  // Wait for Stripe iframe to load
  await page.waitForSelector('iframe[name*="__privateStripeFrame"]', {
    timeout: TIMEOUTS.STRIPE_REDIRECT
  });
  
  // Wait a bit more for Stripe to fully initialize
  await page.waitForTimeout(2000);
}

/**
 * Handle Stripe card input in iframe
 */
export async function fillStripeCardField(
  page: Page, 
  fieldName: string, 
  value: string
): Promise<void> {
  const frame = page.frameLocator('iframe[name*="__privateStripeFrame"]').first();
  await frame.locator(`[name="${fieldName}"]`).fill(value);
}

/**
 * Verify page accessibility basics
 */
export async function checkBasicAccessibility(page: Page): Promise<void> {
  // Check for page title
  const title = await page.title();
  expect(title).toBeTruthy();
  expect(title.length).toBeGreaterThan(0);
  
  // Check for main heading
  const h1 = page.locator('h1');
  await expect(h1).toBeVisible();
  
  // Check for skip links (if present)
  const skipLink = page.locator('a[href="#main"], a[href="#content"]');
  if (await skipLink.count() > 0) {
    await expect(skipLink.first()).toBeVisible();
  }
}

/**
 * Monitor console errors during test
 */
export async function monitorConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  return errors;
}

/**
 * Check for broken images
 */
export async function checkForBrokenImages(page: Page): Promise<string[]> {
  const brokenImages: string[] = [];
  
  const images = page.locator('img');
  const count = await images.count();
  
  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const src = await img.getAttribute('src');
    
    if (src) {
      try {
        const response = await page.request.get(src);
        if (!response.ok()) {
          brokenImages.push(src);
        }
      } catch (error) {
        brokenImages.push(src);
      }
    }
  }
  
  return brokenImages;
}

/**
 * Verify responsive design at different breakpoints
 */
export async function testResponsiveBreakpoints(
  page: Page, 
  testFunction: () => Promise<void>
): Promise<void> {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 },
    { name: 'large', width: 1920, height: 1080 }
  ];
  
  for (const breakpoint of breakpoints) {
    await page.setViewportSize({ 
      width: breakpoint.width, 
      height: breakpoint.height 
    });
    
    await page.waitForTimeout(500); // Allow layout to settle
    
    try {
      await testFunction();
      console.log(`✓ ${breakpoint.name} (${breakpoint.width}x${breakpoint.height}) passed`);
    } catch (error) {
      console.error(`✗ ${breakpoint.name} (${breakpoint.width}x${breakpoint.height}) failed:`, error);
      throw error;
    }
  }
}

/**
 * Simulate slow network conditions
 */
export async function simulateSlowNetwork(page: Page): Promise<void> {
  await page.route('**/*', async route => {
    // Add delay to simulate slow network
    await new Promise(resolve => setTimeout(resolve, 100));
    await route.continue();
  });
}

/**
 * Clear browser storage
 */
export async function clearBrowserStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Clear cookies
  const context = page.context();
  await context.clearCookies();
}

/**
 * Generate test report data
 */
export interface TestMetrics {
  testName: string;
  duration: number;
  status: 'passed' | 'failed' | 'skipped';
  screenshots: string[];
  errors: string[];
  performance: {
    loadTime: number;
    networkRequests: number;
  };
}

export async function collectTestMetrics(
  page: Page, 
  testName: string, 
  startTime: number
): Promise<TestMetrics> {
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Collect performance metrics
  const performanceEntries = await page.evaluate(() => {
    return {
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      networkRequests: performance.getEntriesByType('resource').length
    };
  });
  
  return {
    testName,
    duration,
    status: 'passed', // This would be set based on test result
    screenshots: [],
    errors: [],
    performance: performanceEntries
  };
}

/**
 * Retry operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page, 
  urlPattern: string | RegExp,
  timeout: number = TIMEOUTS.PAYMENT_PROCESSING
): Promise<any> {
  const response = await page.waitForResponse(
    response => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
  
  return response.json();
}

/**
 * Mock API responses for testing
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  responseData: any,
  status: number = 200
): Promise<void> {
  await page.route(urlPattern, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(responseData)
    });
  });
}

/**
 * Verify SSL certificate and security
 */
export async function checkSecurityIndicators(page: Page): Promise<void> {
  // Check for HTTPS
  const url = page.url();
  expect(url).toMatch(/^https:/);
  
  // Check for security indicators in the UI
  const securityIndicators = [
    'text=secure',
    'text=encrypted',
    '[data-testid="security-badge"]',
    '.security-indicator'
  ];
  
  let foundIndicator = false;
  for (const indicator of securityIndicators) {
    if (await page.locator(indicator).count() > 0) {
      foundIndicator = true;
      break;
    }
  }
  
  // At least one security indicator should be present on checkout pages
  if (url.includes('/checkout')) {
    expect(foundIndicator).toBe(true);
  }
}
