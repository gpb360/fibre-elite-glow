import { test, expect } from '@playwright/test';

test.describe('Admin Section - Order Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
  });

  test('customer can view order history after login', async ({ page }) => {
    // Login with test credentials
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');

    // Wait for successful login and redirect to account
    await page.waitForURL('/account');
    
    // Verify we're on the account page
    await expect(page.locator('h1')).toContainText('My Account');

    // Click on the Orders tab
    await page.click('[data-testid="orders-tab"]');
    
    // Wait for orders to load
    await page.waitForSelector('[data-testid="order-history-container"]', { timeout: 10000 });

    // Verify order history section is visible
    await expect(page.locator('h2')).toContainText('Order History');

    // Check if orders are displayed or empty state is shown
    const orderCards = page.locator('[data-testid="order-card"]');
    
    if (await orderCards.count() > 0) {
      // If orders exist, verify order information
      const firstOrder = orderCards.first();
      
      // Verify order number is displayed
      await expect(firstOrder.locator('[data-testid="order-number"]')).toBeVisible();
      
      // Verify order status is displayed
      await expect(firstOrder.locator('[data-testid="order-status"]')).toBeVisible();
      
      // Verify order total is displayed
      await expect(firstOrder.locator('[data-testid="order-total"]')).toBeVisible();
      
      // Verify order date is displayed
      await expect(firstOrder.locator('[data-testid="order-date"]')).toBeVisible();
      
      // Click "View Details" button
      await firstOrder.locator('[data-testid="view-details-button"]').click();
      
      // Verify navigation to order details page
      await page.waitForURL(/\/account\/orders\/.*/);
      
      // Verify order details page elements
      await expect(page.locator('h1')).toContainText('Order Details');
      
      // Verify order status timeline
      await expect(page.locator('[data-testid="order-status-timeline"]')).toBeVisible();
      
      // Verify order items section
      await expect(page.locator('[data-testid="order-items"]')).toBeVisible();
      
      // Verify order summary
      await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
      
      // Verify shipping address
      await expect(page.locator('[data-testid="shipping-address"]')).toBeVisible();
      
    } else {
      // If no orders, verify empty state is displayed
      await expect(page.locator('[data-testid="no-orders-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="start-shopping-button"]')).toBeVisible();
    }
  });

  test('customer can navigate between account tabs', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/account');

    // Test Overview tab
    await expect(page.locator('[data-testid="overview-tab"]')).toBeVisible();
    await page.click('[data-testid="overview-tab"]');
    await expect(page.locator('[data-testid="overview-content"]')).toBeVisible();

    // Test Orders tab
    await page.click('[data-testid="orders-tab"]');
    await expect(page.locator('[data-testid="orders-content"]')).toBeVisible();

    // Test Profile tab
    await page.click('[data-testid="profile-tab"]');
    await expect(page.locator('[data-testid="profile-content"]')).toBeVisible();

    // Test Settings tab
    await page.click('[data-testid="settings-tab"]');
    await expect(page.locator('[data-testid="settings-content"]')).toBeVisible();
  });

  test('customer can view account overview with statistics', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/account');

    // Verify overview cards are displayed
    await expect(page.locator('[data-testid="total-orders-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-spent-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="account-status-card"]')).toBeVisible();

    // Verify recent orders section
    await expect(page.locator('[data-testid="recent-orders-section"]')).toBeVisible();

    // Verify profile summary section
    await expect(page.locator('[data-testid="profile-summary-section"]')).toBeVisible();
  });

  test('unauthorized user cannot access account pages', async ({ page }) => {
    // Try to access account page without login
    await page.goto('/account');
    
    // Should redirect to login page
    await page.waitForURL('/login');
    
    // Try to access order details without login
    await page.goto('/account/orders/test-order-id');
    
    // Should redirect to login page
    await page.waitForURL('/login');
  });

  test('customer can sign out from account page', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/account');

    // Click sign out button
    await page.click('[data-testid="sign-out-button"]');

    // Should redirect to home page
    await page.waitForURL('/');

    // Try to access account page again
    await page.goto('/account');
    
    // Should redirect to login page
    await page.waitForURL('/login');
  });

  test('order details page displays correct information', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/account');

    // Navigate to orders
    await page.click('[data-testid="orders-tab"]');
    await page.waitForSelector('[data-testid="order-history-container"]');

    const orderCards = page.locator('[data-testid="order-card"]');
    
    if (await orderCards.count() > 0) {
      // Click on first order
      await orderCards.first().locator('[data-testid="view-details-button"]').click();
      await page.waitForURL(/\/account\/orders\/.*/);

      // Verify order number in header
      await expect(page.locator('[data-testid="order-number-header"]')).toBeVisible();

      // Verify order status badge
      await expect(page.locator('[data-testid="order-status-badge"]')).toBeVisible();

      // Verify order status timeline steps
      const timelineSteps = page.locator('[data-testid="timeline-step"]');
      if (await timelineSteps.count() > 0) {
        await expect(timelineSteps.first()).toBeVisible();
      }

      // Verify order items are listed
      const orderItems = page.locator('[data-testid="order-item"]');
      if (await orderItems.count() > 0) {
        const firstItem = orderItems.first();
        
        // Verify item name
        await expect(firstItem.locator('[data-testid="item-name"]')).toBeVisible();
        
        // Verify item quantity
        await expect(firstItem.locator('[data-testid="item-quantity"]')).toBeVisible();
        
        // Verify item price
        await expect(firstItem.locator('[data-testid="item-price"]')).toBeVisible();
      }

      // Verify order summary breakdown
      await expect(page.locator('[data-testid="subtotal"]')).toBeVisible();
      await expect(page.locator('[data-testid="shipping"]')).toBeVisible();
      await expect(page.locator('[data-testid="tax"]')).toBeVisible();
      await expect(page.locator('[data-testid="total"]')).toBeVisible();

      // Verify action buttons
      await expect(page.locator('[data-testid="reorder-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="contact-support-button"]')).toBeVisible();
    }
  });

  test('error handling for failed order requests', async ({ page }) => {
    // Mock a failed network request for orders
    await page.route('**/functions/v1/get-orders*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/account');

    // Navigate to orders tab
    await page.click('[data-testid="orders-tab"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Should show retry button
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test('loading states are displayed during data fetching', async ({ page }) => {
    // Mock a slow response
    await page.route('**/functions/v1/get-orders*', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ orders: [], total: 0, hasMore: false })
        });
      }, 2000); // 2 second delay
    });

    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/account');

    // Navigate to orders tab
    await page.click('[data-testid="orders-tab"]');

    // Should show loading spinner
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // Should show loading text
    await expect(page.locator('text=Loading orders...')).toBeVisible();

    // Wait for loading to complete
    await page.waitForSelector('[data-testid="order-history-container"]', { timeout: 5000 });
  });
});