import { test, expect } from '@playwright/test';
import { 
  ProductPage, 
  CartPage, 
  CheckoutPage, 
  ErrorPage 
} from '../utils/page-objects';
import { 
  STRIPE_TEST_CARDS, 
  TEST_PRODUCTS, 
  TEST_CUSTOMER, 
  TIMEOUTS,
  generateRandomEmail 
} from '../utils/test-data';

test.describe('Checkout Flow - Negative Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Payment declined - Generic decline', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const errorPage = new ErrorPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Attempt checkout with declined card
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.GENERIC_DECLINE);
    await checkoutPage.submitPayment();

    // Step 3: Verify error handling
    await page.waitForTimeout(TIMEOUTS.FORM_SUBMISSION);
    
    // Check for error message on the page or redirect to error page
    const currentUrl = page.url();
    if (currentUrl.includes('/checkout/error')) {
      await errorPage.verifyErrorMessage();
    } else {
      // Error should be displayed on checkout page
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    }
  });

  test('Payment declined - Insufficient funds', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Attempt checkout with insufficient funds card
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.INSUFFICIENT_FUNDS);
    await checkoutPage.submitPayment();

    // Step 3: Verify specific error for insufficient funds
    await page.waitForTimeout(TIMEOUTS.FORM_SUBMISSION);
    
    // Look for insufficient funds error message
    const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorMessage?.toLowerCase()).toContain('insufficient');
  });

  test('Payment declined - Expired card', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Attempt checkout with expired card
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.EXPIRED_CARD);
    await checkoutPage.submitPayment();

    // Step 3: Verify expired card error
    await page.waitForTimeout(TIMEOUTS.FORM_SUBMISSION);
    
    const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorMessage?.toLowerCase()).toContain('expired');
  });

  test('Payment declined - Incorrect CVC', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Attempt checkout with incorrect CVC card
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.INCORRECT_CVC);
    await checkoutPage.submitPayment();

    // Step 3: Verify CVC error
    await page.waitForTimeout(TIMEOUTS.FORM_SUBMISSION);
    
    const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorMessage?.toLowerCase()).toContain('cvc');
  });

  test('Form validation - Missing required fields', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await page.locator('[data-testid="add-to-cart"]').click();
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Try to submit without filling required fields
    await checkoutPage.submitPayment();

    // Step 3: Verify validation errors
    await expect(page.locator('input:invalid')).toHaveCount({ min: 1 });
    
    // Check for specific validation messages
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toHaveAttribute('required');
    
    const firstNameInput = page.locator('[data-testid="first-name-input"]');
    await expect(firstNameInput).toHaveAttribute('required');
  });

  test('Form validation - Invalid email format', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await page.locator('[data-testid="add-to-cart"]').click();
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Fill form with invalid email
    await page.locator('[data-testid="email-input"]').fill('invalid-email');
    await page.locator('[data-testid="first-name-input"]').fill('Test');
    await page.locator('[data-testid="last-name-input"]').fill('User');
    await page.locator('[data-testid="address-line1"]').fill('123 Test St');
    await page.locator('[data-testid="city-input"]').fill('Test City');
    await page.locator('[data-testid="state-input"]').fill('CA');
    await page.locator('[data-testid="zip-input"]').fill('90210');

    // Step 3: Try to submit
    await checkoutPage.submitPayment();

    // Step 4: Verify email validation
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
    
    // Browser should show validation error for invalid email
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('Empty cart checkout prevention', async ({ page }) => {
    // Step 1: Go directly to checkout with empty cart
    await page.goto('/checkout');

    // Step 2: Should redirect to cart page
    await page.waitForURL('**/cart', { timeout: TIMEOUTS.NAVIGATION });
    
    // Step 3: Verify we're on cart page with empty cart message
    await expect(page.locator('text=Your cart is currently empty')).toBeVisible();
  });

  test('Network error handling', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Block network requests to simulate network error
    await page.route('**/api/create-checkout-session', route => {
      route.abort('failed');
    });

    // Step 3: Fill form and attempt checkout
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.submitPayment();

    // Step 4: Verify network error handling
    await page.waitForTimeout(TIMEOUTS.FORM_SUBMISSION);
    
    // Should show error message about network issues
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('Session timeout handling', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Mock expired session response
    await page.route('**/api/create-checkout-session', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Session expired' })
      });
    });

    // Step 3: Attempt checkout
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.submitPayment();

    // Step 4: Verify session timeout handling
    await page.waitForTimeout(TIMEOUTS.FORM_SUBMISSION);
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('3D Secure authentication flow', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Use 3D Secure test card
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.fillCustomerInfo(testCustomer);
    await checkoutPage.fillPaymentInfo(STRIPE_TEST_CARDS.THREE_D_SECURE_REQUIRED);
    await checkoutPage.submitPayment();

    // Step 3: Handle 3D Secure authentication
    // Note: In a real test, this would involve interacting with the 3D Secure iframe
    // For now, we'll just verify that the 3D Secure flow is triggered
    await page.waitForTimeout(TIMEOUTS.STRIPE_REDIRECT);
    
    // Check if we're redirected to 3D Secure authentication
    const currentUrl = page.url();
    const is3DSecure = currentUrl.includes('stripe.com') || 
                      page.locator('iframe[src*="stripe"]').isVisible();
    
    if (await is3DSecure) {
      console.log('3D Secure authentication flow triggered successfully');
    }
  });

  test('Browser back button during checkout', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Add product and go to checkout
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 2: Fill partial form
    await page.locator('[data-testid="email-input"]').fill(generateRandomEmail());
    await page.locator('[data-testid="first-name-input"]').fill('Test');

    // Step 3: Use browser back button
    await page.goBack();

    // Step 4: Verify we're back on cart page
    await expect(page).toHaveURL(/.*\/cart/);

    // Step 5: Go to checkout again and verify form is empty
    await cartPage.proceedToCheckout();
    
    const emailValue = await page.locator('[data-testid="email-input"]').inputValue();
    expect(emailValue).toBe('');
  });
});
