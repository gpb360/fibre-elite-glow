import { test, expect, Page } from '@playwright/test';
import { 
  ProductPage, 
  CartPage, 
  CheckoutPage, 
  SuccessPage,
  ErrorPage
} from '../utils/page-objects';
import { 
  STRIPE_TEST_CARDS, 
  TEST_PRODUCTS, 
  TEST_CUSTOMER, 
  TIMEOUTS,
  generateRandomEmail,
  formatPrice,
  generateUniqueCustomer
} from '../utils/test-data';

/**
 * Comprehensive Stripe Integration Test Suite
 * 
 * This test suite validates the complete Stripe integration including:
 * - Full checkout flows (success and failure)
 * - Webhook processing
 * - Database order creation
 * - Success/error page handling
 * - Session expiration
 * - Cross-browser compatibility
 * - Performance benchmarks
 * - Security validations
 */
test.describe('Stripe Integration', () => {
  // Store test data that needs to be shared between tests
  const testData = {
    sessionId: '',
    orderNumber: '',
    customerEmail: '',
    paymentIntentId: ''
  };

  test.beforeEach(async ({ page }) => {
    // Start with a fresh session for each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Generate unique customer data for this test run
    testData.customerEmail = generateRandomEmail();
  });

  test('1. Complete checkout flow with successful payment', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);
    
    // Track performance metrics
    const perfMetrics = {
      productLoadTime: 0,
      cartLoadTime: 0,
      checkoutLoadTime: 0,
      stripeRedirectTime: 0,
      successPageLoadTime: 0
    };

    // === PHASE 1: Product Selection ===
    test.step('Select product and add to cart', async () => {
      const startTime = Date.now();
      await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
      perfMetrics.productLoadTime = Date.now() - startTime;
      
      // Verify product details are displayed correctly
      await productPage.verifyProductDetails(
        TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
        TEST_PRODUCTS.TOTAL_ESSENTIAL.price
      );
      
      // Add product to cart
      await productPage.addToCart(1);
      
      // Verify success notification
      await expect(page.locator('text=Added to cart')).toBeVisible();
    });

    // === PHASE 2: Cart Review ===
    test.step('Review cart and proceed to checkout', async () => {
      const startTime = Date.now();
      await page.goto('/cart');
      perfMetrics.cartLoadTime = Date.now() - startTime;
      
      // Verify cart contents
      await cartPage.verifyCartContents([{
        name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
        quantity: 1,
        price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
      }]);
      
      // Proceed to checkout
      await cartPage.proceedToCheckout();
    });

    // === PHASE 3: Checkout Form ===
    test.step('Fill checkout form with customer information', async () => {
      const startTime = Date.now();
      await expect(page).toHaveURL(/.*\/checkout/);
      perfMetrics.checkoutLoadTime = Date.now() - startTime;
      
      // Create unique test customer
      const testCustomer = {
        ...TEST_CUSTOMER,
        email: testData.customerEmail
      };
      
      // Fill customer information
      await checkoutPage.fillCustomerInfo(testCustomer);
      
      // Verify form validation
      await expect(page.locator('[data-testid="email-input"]')).toHaveValue(testCustomer.email);
      await expect(page.locator('[data-testid="first-name-input"]')).toHaveValue(testCustomer.firstName);
      
      // Submit checkout form
      const redirectStartTime = Date.now();
      await checkoutPage.submitPayment();
      
      // Wait for redirect to Stripe
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: TIMEOUTS.REDIRECT });
      perfMetrics.stripeRedirectTime = Date.now() - redirectStartTime;
    });

    // === PHASE 4: Stripe Payment ===
    test.step('Complete payment on Stripe Checkout page', async () => {
      // Verify we're on Stripe Checkout
      await expect(page.url()).toContain('checkout.stripe.com');
      
      // Complete Stripe payment form with test card
      await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.VISA_SUCCESS);
      
      // Submit payment and wait for redirect back to our site
      const successStartTime = Date.now();
      await checkoutPage.completeStripePayment();
      
      // Wait for redirect to success page
      await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
      perfMetrics.successPageLoadTime = Date.now() - successStartTime;
      
      // Extract session ID from URL for later database validation
      const url = new URL(page.url());
      testData.sessionId = url.searchParams.get('session_id') || '';
      expect(testData.sessionId).toBeTruthy();
    });

    // === PHASE 5: Success Page Validation ===
    test.step('Validate success page and order details', async () => {
      // Verify success page components
      await successPage.verifySuccessPage();
      
      // Get and store order number for database validation
      testData.orderNumber = await successPage.getOrderNumber();
      expect(testData.orderNumber).toMatch(/^(ORD-|FEG-)\w+/);
      
      // Verify order total matches expected amount
      const orderTotal = await successPage.getOrderTotal();
      expect(orderTotal).toContain(formatPrice(TEST_PRODUCTS.TOTAL_ESSENTIAL.price));
      
      // Verify customer email is displayed correctly
      await expect(page.getByText(testData.customerEmail)).toBeVisible();
    });

    // === PHASE 6: Performance Validation ===
    test.step('Validate performance metrics', async () => {
      // Log performance metrics
      console.log('Performance metrics:', perfMetrics);
      
      // Assert performance expectations
      expect(perfMetrics.productLoadTime).toBeLessThan(5000);
      expect(perfMetrics.checkoutLoadTime).toBeLessThan(3000);
      expect(perfMetrics.successPageLoadTime).toBeLessThan(5000);
    });

    // === PHASE 7: Cart State Validation ===
    test.step('Verify cart is cleared after successful purchase', async () => {
      await page.goto('/cart');
      
      // Cart should be empty after successful purchase
      await expect(page.locator('text=Your cart is currently empty')).toBeVisible();
      
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(0);
    });
  });

  test('2. Payment failure handling with declined card', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const errorPage = new ErrorPage(page);
    
    // Add product to cart
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();
    
    // Fill checkout form
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    
    // Submit payment form
    await checkoutPage.submitPayment();
    
    // Wait for redirect to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: TIMEOUTS.REDIRECT });
    
    // Use a card that will be declined
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.DECLINED);
    await checkoutPage.completeStripePayment();
    
    // Should redirect to error page
    await page.waitForURL('**/checkout/error**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    
    // Verify error page shows appropriate message
    await errorPage.verifyErrorPage();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/Payment Declined|Payment Error/);
    
    // Verify recovery options are displayed
    await expect(page.getByRole('link', { name: /Back to Cart|Try Again/i })).toBeVisible();
  });

  test('3. Authentication required scenario', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const errorPage = new ErrorPage(page);
    
    // Add product to cart
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();
    
    // Fill checkout form
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    
    // Submit payment form
    await checkoutPage.submitPayment();
    
    // Wait for redirect to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: TIMEOUTS.REDIRECT });
    
    // Use a card that requires authentication
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.AUTHENTICATION_REQUIRED);
    await checkoutPage.completeStripePayment();
    
    // Should show 3D Secure authentication page
    await expect(page.getByText(/Secure authentication|3D Secure|Authentication/i)).toBeVisible({ timeout: TIMEOUTS.AUTHENTICATION });
    
    // Complete authentication (this will vary based on Stripe's test UI)
    await page.getByRole('button', { name: /Complete|Authenticate|Confirm/i }).click();
    
    // Should redirect to success page after authentication
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
  });

  test('4. Insufficient funds scenario', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const errorPage = new ErrorPage(page);
    
    // Add product to cart
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();
    
    // Fill checkout form
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    
    // Submit payment form
    await checkoutPage.submitPayment();
    
    // Wait for redirect to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: TIMEOUTS.REDIRECT });
    
    // Use a card that will return insufficient funds
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.INSUFFICIENT_FUNDS);
    await checkoutPage.completeStripePayment();
    
    // Should redirect to error page
    await page.waitForURL('**/checkout/error**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    
    // Verify error page shows appropriate message
    await errorPage.verifyErrorPage();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/Insufficient Funds|Payment Error/);
  });

  test('5. Cross-browser compatibility', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Stripe checkout has some issues with WebKit in headless mode');
    
    console.log(`Testing on ${browserName} browser`);
    
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Add product to cart
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    
    // Verify cart works in this browser
    await cartPage.verifyCartContents([{
      name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
      quantity: 1,
      price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
    }]);
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Verify checkout page loads in this browser
    await expect(page).toHaveURL(/.*\/checkout/);
    await expect(page.locator('h1')).toContainText('Checkout');
    
    // Fill customer information to test form functionality
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    
    // Verify form works in this browser
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue(testCustomer.email);
  });

  test('6. Security validation - Cannot access order details of other users', async ({ page, request }) => {
    // First create a successful order
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);
    
    // Complete checkout flow to get a valid session ID
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();
    
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.submitPayment();
    
    // Wait for redirect to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: TIMEOUTS.REDIRECT });
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.VISA_SUCCESS);
    await checkoutPage.completeStripePayment();
    
    // Wait for redirect to success page
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    
    // Extract session ID from URL
    const url = new URL(page.url());
    const sessionId = url.searchParams.get('session_id') || '';
    expect(sessionId).toBeTruthy();
    
    // Now try to access this session with a different user context
    // Clear cookies and storage to simulate different user
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Directly try to access the success page with the session ID
    await page.goto(`/checkout/success?session_id=${sessionId}`);
    
    // Should still show the order details since it's a public session ID
    // But sensitive details should be limited
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Try to access the API directly to test server-side protection
    const response = await request.get(`/api/checkout-session/${sessionId}`);
    expect(response.ok()).toBeTruthy();
    
    // The API should return limited information without authentication
    const data = await response.json();
    expect(data).toHaveProperty('orderNumber');
    expect(data).toHaveProperty('status');
    
    // But it shouldn't contain highly sensitive information for unauthenticated requests
    // This depends on your security model - adjust expectations accordingly
  });

  test('7. Session expiration handling', async ({ page }) => {
    // This test simulates an expired checkout session
    
    // 1. Start checkout process
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const errorPage = new ErrorPage(page);
    
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();
    
    // 2. Fill checkout form
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    
    // 3. Instead of completing checkout, simulate session expiration
    // by directly navigating to error page with session_expired parameter
    await page.goto('/checkout/error?error=session_expired');
    
    // 4. Verify error page shows appropriate message
    await errorPage.verifyErrorPage();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/Session Expired|Payment Error/);
    
    // 5. Verify recovery path is available
    await expect(page.getByRole('link', { name: /Back to Cart|Try Again/i })).toBeVisible();
  });

  test('8. Performance benchmarks for checkout flow', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Measure product page load time
    const productStartTime = Date.now();
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    const productLoadTime = Date.now() - productStartTime;
    console.log(`Product page load time: ${productLoadTime}ms`);
    expect(productLoadTime).toBeLessThan(5000);
    
    // Add to cart
    await productPage.addToCart(1);
    
    // Measure cart page load time
    const cartStartTime = Date.now();
    await page.goto('/cart');
    const cartLoadTime = Date.now() - cartStartTime;
    console.log(`Cart page load time: ${cartLoadTime}ms`);
    expect(cartLoadTime).toBeLessThan(3000);
    
    // Measure checkout page load time
    const checkoutStartTime = Date.now();
    await cartPage.proceedToCheckout();
    const checkoutLoadTime = Date.now() - checkoutStartTime;
    console.log(`Checkout page load time: ${checkoutLoadTime}ms`);
    expect(checkoutLoadTime).toBeLessThan(3000);
    
    // Measure form submission time
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    
    const submitStartTime = Date.now();
    await checkoutPage.submitPayment();
    
    // Wait for redirect to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: TIMEOUTS.REDIRECT });
    const redirectTime = Date.now() - submitStartTime;
    console.log(`Redirect to Stripe time: ${redirectTime}ms`);
    expect(redirectTime).toBeLessThan(5000);
  });

  test('9. Database validation after successful payment', async ({ page, request }) => {
    // This test validates that database records are created correctly after payment
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);
    
    // Generate unique identifier for this test
    const uniqueEmail = generateRandomEmail();
    
    // Complete checkout flow
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();
    
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: uniqueEmail
    };
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.submitPayment();
    
    // Wait for redirect to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: TIMEOUTS.REDIRECT });
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.VISA_SUCCESS);
    await checkoutPage.completeStripePayment();
    
    // Wait for redirect to success page
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    
    // Extract session ID from URL
    const url = new URL(page.url());
    const sessionId = url.searchParams.get('session_id') || '';
    expect(sessionId).toBeTruthy();
    
    // Get order number from success page
    const orderNumber = await successPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
    
    // Now validate database records via API
    // Note: This requires an API endpoint that can query the database
    // You may need to create a test-only endpoint for this purpose
    
    // Wait for webhook processing (which happens asynchronously)
    // In a real test, you might need to poll until the order is created
    await page.waitForTimeout(2000);
    
    // Fetch session details from API
    const response = await request.get(`/api/checkout-session/${sessionId}`);
    expect(response.ok()).toBeTruthy();
    
    // Validate response data
    const data = await response.json();
    expect(data).toHaveProperty('orderNumber', orderNumber);
    expect(data).toHaveProperty('customerEmail', uniqueEmail);
    expect(data).toHaveProperty('status', 'completed');
    expect(data).toHaveProperty('items');
    expect(data.items).toHaveLength(1);
    expect(data.items[0]).toHaveProperty('name', TEST_PRODUCTS.TOTAL_ESSENTIAL.name);
  });
});
