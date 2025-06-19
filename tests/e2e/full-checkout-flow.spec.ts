import { test, expect } from '@playwright/test';
import { 
  ProductPage, 
  CartPage, 
  CheckoutPage, 
  SuccessPage 
} from '../utils/page-objects';
import { 
  STRIPE_TEST_CARDS, 
  TEST_PRODUCTS, 
  TEST_CUSTOMER, 
  TIMEOUTS,
  generateRandomEmail,
  formatPrice 
} from '../utils/test-data';

test.describe('Full E2E Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Complete user journey: Browse → Add to Cart → Checkout → Success', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);

    // === PHASE 1: Product Discovery ===
    test.step('Navigate to homepage and browse products', async () => {
      await expect(page).toHaveTitle(/Fibre Elite Glow/);
      
      // Verify homepage loads correctly
      await expect(page.locator('h1')).toBeVisible();
      
      // Navigate to products section
      await page.locator('text=Shop Now').first().click();
      await page.waitForLoadState('networkidle');
    });

    // === PHASE 2: Product Selection ===
    test.step('Select and view product details', async () => {
      await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
      
      // Verify product page loads
      await productPage.verifyProductDetails(
        TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
        TEST_PRODUCTS.TOTAL_ESSENTIAL.price
      );
      
      // Check product information is displayed
      await expect(page.locator('text=Premium gut health')).toBeVisible();
      await expect(page.locator('[data-testid="price"]')).toContainText(
        formatPrice(TEST_PRODUCTS.TOTAL_ESSENTIAL.price)
      );
    });

    // === PHASE 3: Add to Cart ===
    test.step('Add product to cart with quantity selection', async () => {
      // Test quantity selection
      await page.locator('[data-testid="quantity-input"]').fill('2');
      
      // Add to cart
      await productPage.addToCart(2);
      
      // Verify cart icon updates (if visible)
      const cartIcon = page.locator('[data-testid="cart-icon"]');
      if (await cartIcon.isVisible()) {
        await expect(page.locator('[data-testid="cart-count"]')).toContainText('2');
      }
      
      // Verify success notification
      await expect(page.locator('text=Added to cart')).toBeVisible();
    });

    // === PHASE 4: Cart Management ===
    test.step('Review and manage cart contents', async () => {
      await page.goto('/cart');
      
      // Verify cart contents
      await cartPage.verifyCartContents([{
        name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
        quantity: 2,
        price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
      }]);
      
      // Test cart functionality
      await cartPage.updateQuantity(0, 3);
      
      // Verify total updates
      const expectedTotal = TEST_PRODUCTS.TOTAL_ESSENTIAL.price * 3;
      const cartTotal = await cartPage.getCartTotal();
      expect(cartTotal).toContain(expectedTotal.toFixed(2));
      
      // Test remove and re-add
      await cartPage.updateQuantity(0, 1);
    });

    // === PHASE 5: Checkout Process ===
    test.step('Proceed to secure checkout', async () => {
      await cartPage.proceedToCheckout();
      
      // Verify checkout page loads
      await expect(page).toHaveURL(/.*\/checkout/);
      await expect(page.locator('h1')).toContainText('Checkout');
      
      // Verify SSL/security indicators
      await expect(page.locator('text=secure')).toBeVisible();
    });

    // === PHASE 6: Customer Information ===
    test.step('Fill customer information', async () => {
      const testCustomer = {
        ...TEST_CUSTOMER,
        email: generateRandomEmail()
      };
      
      await checkoutPage.fillCustomerInfo(testCustomer);
      
      // Verify form validation
      await expect(page.locator('[data-testid="email-input"]')).toHaveValue(testCustomer.email);
      await expect(page.locator('[data-testid="first-name-input"]')).toHaveValue(testCustomer.firstName);
    });

    // === PHASE 7: Payment Processing ===
    test.step('Process payment with Stripe', async () => {
      // Fill payment information
      await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.VISA_SUCCESS);
      
      // Submit payment
      await checkoutPage.submitPayment();
      
      // Wait for Stripe processing
      await page.waitForTimeout(2000);
    });

    // === PHASE 8: Order Confirmation ===
    test.step('Verify successful order completion', async () => {
      // Wait for redirect to success page
      await page.waitForURL('**/checkout/success**', { 
        timeout: TIMEOUTS.PAYMENT_PROCESSING 
      });
      
      // Verify success page
      await successPage.verifySuccessPage();
      
      // Verify order details
      const expectedTotal = TEST_PRODUCTS.TOTAL_ESSENTIAL.price * 1; // Final quantity
      await successPage.verifyOrderDetails(expectedTotal);
      
      // Verify order number generation
      const orderNumber = await successPage.getOrderNumber();
      expect(orderNumber).toMatch(/^FEG-\d+-[A-Z0-9]+$/);
      
      // Verify order total
      const orderTotal = await successPage.getOrderTotal();
      expect(orderTotal).toContain(formatPrice(expectedTotal));
    });

    // === PHASE 9: Post-Purchase Experience ===
    test.step('Verify post-purchase elements', async () => {
      // Check for confirmation elements
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      
      // Verify next steps information
      await expect(page.locator('text=Confirmation Email')).toBeVisible();
      await expect(page.locator('text=Processing & Shipping')).toBeVisible();
      
      // Test navigation options
      await expect(page.locator('text=Continue Shopping')).toBeVisible();
      await expect(page.locator('text=Download Receipt')).toBeVisible();
    });

    // === PHASE 10: Cart Cleanup ===
    test.step('Verify cart is cleared after successful purchase', async () => {
      await page.goto('/cart');
      
      // Cart should be empty after successful purchase
      await expect(page.locator('text=Your cart is currently empty')).toBeVisible();
      
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });
  });

  test('Mobile responsive checkout flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);

    // Mobile-specific test flow
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    
    // Verify mobile layout
    await expect(page.locator('body')).toHaveCSS('width', '375px');
    
    // Complete mobile checkout flow
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();
    
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.completeCheckout(STRIPE_TEST_CARDS.VISA_SUCCESS, testCustomer);
    
    // Verify mobile success page
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    await successPage.verifySuccessPage();
  });

  test('Cross-browser compatibility test', async ({ page, browserName }) => {
    // Test basic functionality across different browsers
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    console.log(`Testing on ${browserName}`);
    
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    
    // Verify cart works in all browsers
    await cartPage.verifyCartContents([{
      name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
      quantity: 1,
      price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
    }]);
    
    // Test checkout page loads
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*\/checkout/);
  });

  test('Performance and loading test', async ({ page }) => {
    // Monitor performance during checkout flow
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Measure page load times
    const startTime = Date.now();
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    const productLoadTime = Date.now() - startTime;
    
    console.log(`Product page load time: ${productLoadTime}ms`);
    expect(productLoadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Test cart performance
    const cartStartTime = Date.now();
    await productPage.addToCart(1);
    await page.goto('/cart');
    const cartLoadTime = Date.now() - cartStartTime;
    
    console.log(`Cart load time: ${cartLoadTime}ms`);
    expect(cartLoadTime).toBeLessThan(3000); // Cart should load quickly
    
    // Test checkout page performance
    const checkoutStartTime = Date.now();
    await cartPage.proceedToCheckout();
    const checkoutLoadTime = Date.now() - checkoutStartTime;
    
    console.log(`Checkout load time: ${checkoutLoadTime}ms`);
    expect(checkoutLoadTime).toBeLessThan(5000); // Checkout should load within 5 seconds
  });

  test('Accessibility compliance test', async ({ page }) => {
    // Basic accessibility testing
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    
    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check form labels
    await page.goto('/checkout');
    const inputs = page.locator('input[required]');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }
  });
});
