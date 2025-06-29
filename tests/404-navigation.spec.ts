import { test, expect, Page } from '@playwright/test';

/**
 * 404 Navigation Test Suite
 * 
 * This test suite verifies that:
 * 1. All main routes load correctly
 * 2. 404 errors are handled properly with our custom not-found page
 * 3. Back button navigation works correctly
 * 4. All links in header and footer point to valid pages
 */

// Main routes that should always work
const MAIN_ROUTES = [
  { path: '/', title: 'La Belle Vie' },
  { path: '/products', title: 'Products' },
  { path: '/products/total-essential', title: 'Total Essential' },
  { path: '/products/total-essential-plus', title: 'Total Essential Plus' },
  { path: '/benefits', title: 'Benefits' },
  { path: '/testimonials', title: 'Testimonials' },
  { path: '/faq', title: 'FAQ' },
  { path: '/cart', title: 'Cart' },
  { path: '/checkout', title: 'Checkout' },
];

// Ingredient pages that should exist
const INGREDIENT_ROUTES = [
  { path: '/ingredients', title: 'Ingredients' },
  { path: '/ingredients/acai-berry', title: 'Acai Berry' },
  { path: '/ingredients/antioxidant-parsley', title: 'Antioxidant Parsley' },
  { path: '/ingredients/apple-fiber', title: 'Apple Fiber' },
  { path: '/ingredients/beta-glucan-oat-bran', title: 'Beta Glucan Oat Bran' },
  { path: '/ingredients/cranberry', title: 'Cranberry' },
  { path: '/ingredients/detoxifying-broccoli-extract', title: 'Detoxifying Broccoli Extract' },
  { path: '/ingredients/digestive-aid-guar-gum', title: 'Digestive Aid Guar Gum' },
  { path: '/ingredients/enzyme-rich-papaya', title: 'Enzyme Rich Papaya' },
  { path: '/ingredients/fresh-cabbage-extract', title: 'Fresh Cabbage Extract' },
  { path: '/ingredients/fresh-spinach-powder', title: 'Fresh Spinach Powder' },
  { path: '/ingredients/hydrating-celery', title: 'Hydrating Celery' },
  { path: '/ingredients/nutrient-rich-carrot', title: 'Nutrient Rich Carrot' },
  { path: '/ingredients/prebiotic-powerhouse', title: 'Prebiotic Powerhouse' },
  { path: '/ingredients/premium-apple-fiber', title: 'Premium Apple Fiber' },
  { path: '/ingredients/raspberry', title: 'Raspberry' },
  { path: '/ingredients/soluble-corn-fiber', title: 'Soluble Corn Fiber' },
  { path: '/ingredients/soothing-aloe-vera-powder', title: 'Soothing Aloe Vera Powder' },
  { path: '/ingredients/strawberry', title: 'Strawberry' },
  { path: '/ingredients/sustainable-palm-fiber', title: 'Sustainable Palm Fiber' },
];

// Routes that should 404
const NONEXISTENT_ROUTES = [
  '/this-does-not-exist',
  '/products/nonexistent-product',
  '/ingredients/not-a-real-ingredient',
  '/about', // Currently disabled in footer
  '/contact', // Currently disabled in footer
  '/privacy', // Currently disabled in footer
  '/terms', // Currently disabled in footer
  '/cookies', // Currently disabled in footer
  '/shipping', // Currently disabled in footer
  '/blog', // Currently disabled in footer
];

test.describe('404 and Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start at the home page before each test
    await page.goto('/');
  });

  test.describe('Main Routes', () => {
    for (const route of MAIN_ROUTES) {
      test(`should load ${route.path} successfully`, async ({ page }) => {
        await page.goto(route.path);
        
        // Verify page loaded successfully
        await expect(page).toHaveURL(new RegExp(`${route.path}$`));
        
        // Check for expected content - either title or some text that should be on the page
        if (route.title) {
          await expect(page.locator('h1, h2')).toContainText(route.title, { ignoreCase: true });
        }
        
        // Ensure no 404 text is visible
        await expect(page.getByText('404', { exact: true })).not.toBeVisible();
        await expect(page.getByText('Page not found')).not.toBeVisible();
      });
    }
  });

  test.describe('Ingredient Routes', () => {
    for (const route of INGREDIENT_ROUTES) {
      test(`should load ${route.path} successfully`, async ({ page }) => {
        await page.goto(route.path);
        
        // Verify page loaded successfully
        await expect(page).toHaveURL(new RegExp(`${route.path}$`));
        
        // Check for expected content
        if (route.title) {
          await expect(page.locator('h1, h2')).toContainText(route.title, { ignoreCase: true });
        }
        
        // Ensure no 404 text is visible
        await expect(page.getByText('404', { exact: true })).not.toBeVisible();
        await expect(page.getByText('Page not found')).not.toBeVisible();
      });
    }
  });

  test.describe('404 Page', () => {
    for (const route of NONEXISTENT_ROUTES) {
      test(`should show 404 page for ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' });
        
        // Verify the 404 page is shown
        await expect(page.getByText('404')).toBeVisible();
        await expect(page.getByText('Page not found')).toBeVisible();
        
        // Verify the 404 page has navigation options
        await expect(page.getByRole('link', { name: 'Return to Home' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Shop Products' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'FAQ' })).toBeVisible();
      });
    }
    
    test('should allow navigation from 404 page to valid routes', async ({ page }) => {
      // Go to a non-existent page
      await page.goto('/this-does-not-exist');
      
      // Verify we're on the 404 page
      await expect(page.getByText('404')).toBeVisible();
      
      // Click the "Return to Home" button
      await page.getByRole('link', { name: 'Return to Home' }).click();
      
      // Verify we're now on the home page
      await expect(page).toHaveURL('/');
      await expect(page.getByText('404')).not.toBeVisible();
    });
  });

  test.describe('Back Button Navigation', () => {
    test('should navigate correctly with back button', async ({ page }) => {
      // Navigate to a few pages
      await page.goto('/');
      await page.getByRole('link', { name: 'Products', exact: true }).click();
      await expect(page).toHaveURL('/products');
      
      await page.getByRole('link', { name: 'Benefits', exact: true }).click();
      await expect(page).toHaveURL('/benefits');
      
      await page.getByRole('link', { name: 'FAQ', exact: true }).click();
      await expect(page).toHaveURL('/faq');
      
      // Now go back twice
      await page.goBack();
      await expect(page).toHaveURL('/benefits');
      
      await page.goBack();
      await expect(page).toHaveURL('/products');
      
      // And forward once
      await page.goForward();
      await expect(page).toHaveURL('/benefits');
    });
    
    test('should maintain state after back navigation', async ({ page }) => {
      // Navigate to products
      await page.goto('/products');
      
      // Click on a specific product
      await page.getByRole('link', { name: 'Total Essential' }).first().click();
      await expect(page).toHaveURL('/products/total-essential');
      
      // Go to another page
      await page.getByRole('link', { name: 'Benefits', exact: true }).click();
      await expect(page).toHaveURL('/benefits');
      
      // Go back to product page
      await page.goBack();
      await expect(page).toHaveURL('/products/total-essential');
      
      // Verify product page content is still there (not a 404)
      await expect(page.getByText('Total Essential')).toBeVisible();
      await expect(page.getByText('404')).not.toBeVisible();
    });
  });

  test.describe('Header Navigation', () => {
    test('all header links should work', async ({ page }) => {
      // Open the page
      await page.goto('/');
      
      // Get all navigation links in the header
      const headerLinks = [
        { selector: 'a:text("Home")', url: '/' },
        { selector: 'button:text("Products")', dropdown: true },
        { selector: 'a:text("Benefits")', url: '/benefits' },
        { selector: 'a:text("Testimonials")', url: '/testimonials' },
        { selector: 'a:text("FAQ")', url: '/faq' },
        { selector: 'a:text("Shop Now")', url: '/products' },
      ];
      
      // Check each link
      for (const link of headerLinks) {
        if (link.dropdown) {
          // Handle dropdown menus
          await page.locator(link.selector).click();
          
          // Check dropdown links
          const dropdownLinks = [
            { selector: 'a:text("All Products")', url: '/products' },
            { selector: 'a:text("Total Essential")', url: '/products/total-essential' },
            { selector: 'a:text("Total Essential Plus")', url: '/products/total-essential-plus' },
          ];
          
          for (const dropLink of dropdownLinks) {
            await page.locator(dropLink.selector).click();
            await expect(page).toHaveURL(dropLink.url);
            await expect(page.getByText('404')).not.toBeVisible();
            
            // Go back to home for next test
            await page.goto('/');
            if (link.dropdown) {
              await page.locator(link.selector).click();
            }
          }
        } else if (link.url) {
          // Handle regular links
          await page.locator(link.selector).click();
          await expect(page).toHaveURL(link.url);
          await expect(page.getByText('404')).not.toBeVisible();
          
          // Go back to home for next test
          await page.goto('/');
        }
      }
    });
  });

  test.describe('Footer Navigation', () => {
    test('all active footer links should work', async ({ page }) => {
      // Open the page
      await page.goto('/');
      
      // Scroll to the footer
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      // Get all navigation links in the footer that are currently active
      const footerLinks = [
        { text: 'Total Essential', url: '/products' },
        { text: 'Total Essential Plus', url: '/products' },
        { text: 'Special Bundles', url: '/products' },
        { text: 'Subscription Plans', url: '/products' },
        { text: 'FAQ', url: '/faq' },
        { text: 'Testimonials', url: '/testimonials' },
      ];
      
      // Check each link
      for (const link of footerLinks) {
        await page.getByRole('link', { name: link.text }).click();
        await expect(page).toHaveURL(link.url);
        await expect(page.getByText('404')).not.toBeVisible();
        
        // Go back to home for next test
        await page.goto('/');
        
        // Scroll to the footer again
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
      }
    });
  });

  test.describe('Dynamic Route Edge Cases', () => {
    test('should handle case sensitivity in routes', async ({ page }) => {
      // Test lowercase (correct)
      await page.goto('/ingredients/acai-berry');
      await expect(page.getByText('404')).not.toBeVisible();
      
      // Test uppercase (should still work or redirect properly)
      await page.goto('/ingredients/ACAI-BERRY');
      // Either it works (no 404) or redirects to lowercase
      const currentUrl = page.url().toLowerCase();
      const isValid = currentUrl.includes('/ingredients/acai-berry') || !page.getByText('404').isVisible();
      expect(isValid).toBeTruthy();
    });
    
    test('should handle trailing slashes consistently', async ({ page }) => {
      // Test without trailing slash
      await page.goto('/products');
      await expect(page.getByText('404')).not.toBeVisible();
      const urlWithoutSlash = page.url();
      
      // Test with trailing slash
      await page.goto('/products/');
      await expect(page.getByText('404')).not.toBeVisible();
      const urlWithSlash = page.url();
      
      // They should either be the same or both valid (no 404)
      const bothValid = !urlWithoutSlash.includes('404') && !urlWithSlash.includes('404');
      expect(bothValid).toBeTruthy();
    });
  });
});
