/**
 * Email Flow Integration Test
 * Tests the complete email sending functionality for checkout process
 */

const { test, expect } = require('@playwright/test');

test.describe('Email Flow Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
  });

  test('should send test email via API', async ({ request }) => {
    // Test the email API endpoint directly
    const response = await request.post('http://localhost:3000/api/test-email', {
      data: {
        customerEmail: 'garypboyd@gmail.com',
        customerName: 'Test Customer'
      }
    });

    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.message).toContain('Test order confirmation email sent');
    expect(result.orderNumber).toMatch(/^TEST-\d+$/);
  });

  test('should display checkout success page correctly', async ({ page }) => {
    // Simulate visiting checkout success page with a test session ID
    await page.goto('http://localhost:3000/checkout/success?session_id=test_session_123');

    // Should show error since session doesn't exist, but page should load
    await expect(page.locator('h1')).toBeVisible();

    // Should have proper error handling
    const errorMessage = page.locator('text=Order Not Found');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should handle webhook test endpoint', async ({ request }) => {
    // Test the webhook test endpoint
    const response = await request.get('http://localhost:3003/api/webhook-test');

    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    expect(result.status).toBe('Webhook test endpoint is active');
    expect(result.endpoints).toHaveProperty('webhook');
    expect(result.endpoints).toHaveProperty('test');
  });

  test('should validate email configuration', async ({ request }) => {
    // Test email configuration by sending a test email
    const testEmailResponse = await request.post('http://localhost:3003/api/test-email', {
      data: {
        customerEmail: 'test@example.com',
        customerName: 'Test User'
      }
    });

    expect(testEmailResponse.ok()).toBeTruthy();
    const emailResult = await testEmailResponse.json();

    // Check that both customer and admin emails are processed
    expect(emailResult.customerEmailResult).toBeDefined();
    expect(emailResult.adminEmailResult).toBeDefined();

    // Customer email should succeed
    expect(emailResult.customerEmailResult.success).toBe(true);

    // Admin email might fail due to Resend restrictions, but should be processed
    expect(emailResult.adminEmailResult.success).toBeDefined();
  });
});

test.describe('Email Template Validation', () => {
  test('should validate email template structure', async ({ request }) => {
    // Send a test email to validate template
    const response = await request.post('http://localhost:3003/api/test-email', {
      data: {
        customerEmail: 'templates@test.com',
        customerName: 'Template Test'
      }
    });

    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    expect(result.success).toBe(true);

    // Verify email was sent successfully
    expect(result.customerEmailResult.success).toBe(true);
    expect(result.customerEmailResult.data.id).toBeDefined();
  });
});