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
  generateRandomEmail 
} from '../utils/test-data';

test.describe('Checkout Flow - Positive Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Complete successful purchase flow - Total Essential', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);

    // Step 1: Navigate to product page
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.verifyProductDetails(
      TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
      TEST_PRODUCTS.TOTAL_ESSENTIAL.price
    );

    // Step 2: Add product to cart
    await productPage.addToCart(1);

    // Step 3: Navigate to cart
    await page.goto('/cart');
    await cartPage.verifyCartContents([{
      name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
      quantity: 1,
      price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
    }]);

    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();

    // Step 5: Complete checkout with successful card
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.completeCheckout(
      STRIPE_TEST_CARDS.VISA_SUCCESS,
      testCustomer
    );

    // Step 6: Verify success page
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    await successPage.verifySuccessPage();
    await successPage.verifyOrderDetails(TEST_PRODUCTS.TOTAL_ESSENTIAL.price);

    // Step 7: Verify order number is generated
    const orderNumber = await successPage.getOrderNumber();
    expect(orderNumber).toMatch(/^[A-Z0-9-]+$/);
  });

  test('Complete successful purchase flow - Total Essential Plus', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);

    // Step 1: Navigate to product page
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.url);
    await productPage.verifyProductDetails(
      TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.name,
      TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.price
    );

    // Step 2: Add product to cart
    await productPage.addToCart(1);

    // Step 3: Navigate to cart and verify
    await page.goto('/cart');
    await cartPage.verifyCartContents([{
      name: TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.name,
      quantity: 1,
      price: TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.price
    }]);

    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();

    // Step 5: Complete checkout with Mastercard
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.completeCheckout(
      STRIPE_TEST_CARDS.MASTERCARD_SUCCESS,
      testCustomer
    );

    // Step 6: Verify success page
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    await successPage.verifySuccessPage();
    await successPage.verifyOrderDetails(TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.price);
  });

  test('Multiple items purchase flow', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);

    // Step 1: Add first product
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(2); // Add 2 quantities

    // Step 2: Add second product
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.url);
    await productPage.addToCart(1);

    // Step 3: Verify cart contents
    await page.goto('/cart');
    await cartPage.verifyCartContents([
      {
        name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
        quantity: 2,
        price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
      },
      {
        name: TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.name,
        quantity: 1,
        price: TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.price
      }
    ]);

    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();

    // Step 5: Complete checkout
    const testCustomer = {
      ...TEST_CUSTOMER,
      email: generateRandomEmail()
    };
    
    await checkoutPage.completeCheckout(
      STRIPE_TEST_CARDS.AMEX_SUCCESS,
      testCustomer
    );

    // Step 6: Verify success page
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    await successPage.verifySuccessPage();
    
    // Calculate expected total
    const expectedTotal = (TEST_PRODUCTS.TOTAL_ESSENTIAL.price * 2) + TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.price;
    await successPage.verifyOrderDetails(expectedTotal);
  });

  test('Guest checkout flow', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const successPage = new SuccessPage(page);

    // Step 1: Add product to cart
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);

    // Step 2: Go to cart and checkout
    await page.goto('/cart');
    await cartPage.proceedToCheckout();

    // Step 3: Complete checkout as guest (no account creation)
    const guestCustomer = {
      email: generateRandomEmail(),
      firstName: 'Guest',
      lastName: 'User',
      address: {
        line1: '456 Guest Street',
        city: 'Guest City',
        state: 'NY',
        postal_code: '10001',
        country: 'US'
      }
    };
    
    await checkoutPage.completeCheckout(
      STRIPE_TEST_CARDS.VISA_DEBIT_SUCCESS,
      guestCustomer
    );

    // Step 4: Verify successful guest checkout
    await page.waitForURL('**/checkout/success**', { timeout: TIMEOUTS.PAYMENT_PROCESSING });
    await successPage.verifySuccessPage();
    await successPage.verifyOrderDetails(TEST_PRODUCTS.TOTAL_ESSENTIAL.price);
  });

  test('Cart persistence across sessions', async ({ page, context }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add item to cart
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);

    // Step 2: Navigate away and back
    await page.goto('/');
    await page.goto('/cart');

    // Step 3: Verify cart persisted
    await cartPage.verifyCartContents([{
      name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
      quantity: 1,
      price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
    }]);

    // Step 4: Create new page in same context (simulates new tab)
    const newPage = await context.newPage();
    await newPage.goto('/cart');
    
    const newCartPage = new CartPage(newPage);
    await newCartPage.verifyCartContents([{
      name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
      quantity: 1,
      price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
    }]);

    await newPage.close();
  });

  test('Cart quantity updates', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add item to cart
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);

    // Step 2: Go to cart
    await page.goto('/cart');

    // Step 3: Update quantity
    await cartPage.updateQuantity(0, 3);

    // Step 4: Verify updated quantity
    await cartPage.verifyCartContents([{
      name: TEST_PRODUCTS.TOTAL_ESSENTIAL.name,
      quantity: 3,
      price: TEST_PRODUCTS.TOTAL_ESSENTIAL.price
    }]);

    // Step 5: Verify total is updated
    const expectedTotal = TEST_PRODUCTS.TOTAL_ESSENTIAL.price * 3;
    const cartTotal = await cartPage.getCartTotal();
    expect(cartTotal).toContain(expectedTotal.toFixed(2));
  });

  test('Remove items from cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Add multiple items
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL.url);
    await productPage.addToCart(1);
    
    await page.goto(TEST_PRODUCTS.TOTAL_ESSENTIAL_PLUS.url);
    await productPage.addToCart(1);

    // Step 2: Go to cart
    await page.goto('/cart');

    // Step 3: Verify both items are present
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBe(2);

    // Step 4: Remove one item
    await cartPage.removeItem(0);

    // Step 5: Verify item was removed
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(1);
  });
});
