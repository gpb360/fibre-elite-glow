import { test, expect } from '@playwright/test';

test.describe('Basic Authentication Tests', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check that the login page loads
    await expect(page).toHaveURL(/\/login$/);
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check for basic page elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for form elements if they exist
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Use timeout to avoid infinite wait
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    await expect(submitButton).toBeVisible({ timeout: 10000 });
  });

  test('should load signup page', async ({ page }) => {
    await page.goto('/signup');
    
    // Check that the signup page loads
    await expect(page).toHaveURL(/\/signup$/);
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check for basic page elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for form elements if they exist
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Use timeout to avoid infinite wait
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    await expect(submitButton).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to login when accessing protected pages', async ({ page }) => {
    await page.goto('/account');
    
    // Wait for redirect
    await page.waitForURL(/\/login$/, { timeout: 10000 });
    
    // Check that we're on the login page
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should navigate between auth pages', async ({ page }) => {
    // Start at login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Look for signup link
    const signupLink = page.locator('a[href="/signup"]');
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL(/\/signup$/);
    }
    
    // Look for login link
    const loginLink = page.locator('a[href="/login"]');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login$/);
    }
  });
});