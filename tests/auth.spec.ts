import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';

  test('should allow a user to sign up and then sign in', async ({ page }) => {
    // Sign up
    await page.goto('/');
    await page.click('button:has-text("Sign In")');
    await page.click('button:has-text("Sign up")');
    
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]:has-text("Sign Up")');
    
    // Wait for a moment to ensure sign-up process completes
    await page.waitForTimeout(2000);

    // Sign in
    await page.click('button:has-text("Sign In")');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]:has-text("Sign In")');

    // Check for successful sign-in, e.g., by looking for a sign-out button or user profile element
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });
});