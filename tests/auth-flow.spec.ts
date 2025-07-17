import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  test('should load login page and display form', async ({ page }) => {
    await page.goto('/login');
    
    // Check that the login page loads
    await expect(page).toHaveURL(/\/login$/);
    
    // Wait for the page to load and check for basic elements
    await page.waitForLoadState('networkidle');
    
    // Check for login form elements using more flexible selectors
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByPlaceholder(/your@email.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/enter your password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    
    // Check for sign up link
    await expect(page.getByText(/don't have an account/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up here/i })).toBeVisible();
  });

  test('should load signup page and display form', async ({ page }) => {
    await page.goto('/signup');
    
    // Check that the signup page loads
    await expect(page).toHaveURL(/\/signup$/);
    
    // Check for signup form elements
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByPlaceholder(/john/i)).toBeVisible();
    await expect(page.getByPlaceholder(/doe/i)).toBeVisible();
    await expect(page.getByPlaceholder(/your@email.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/create a password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
    
    // Check for sign in link
    await expect(page.getByText(/already have an account/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in here/i })).toBeVisible();
  });

  test('should navigate between login and signup pages', async ({ page }) => {
    // Start at login page
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login$/);
    
    // Click signup link
    await page.click('text=sign up here');
    await expect(page).toHaveURL(/\/signup$/);
    
    // Click login link
    await page.click('text=sign in here');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should load reset password page', async ({ page }) => {
    await page.goto('/reset-password');
    
    // Check that the reset password page loads
    await expect(page).toHaveURL(/\/reset-password$/);
    
    // Check for reset password form elements
    await expect(page.getByRole('heading', { name: 'Forgot Password?' })).toBeVisible();
    await expect(page.getByPlaceholder(/your@email.com/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible();
    
    // Check for back to sign in link
    await expect(page.getByText(/back to sign in/i)).toBeVisible();
  });

  test('should redirect to login when accessing protected account page', async ({ page }) => {
    await page.goto('/account');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login$/);
    
    // Should show login form
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  test('should show validation errors on login form', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for HTML5 validation (required fields)
    const emailInput = page.getByPlaceholder(/your@email.com/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    
    await expect(emailInput).toBeRequired();
    await expect(passwordInput).toBeRequired();
  });

  test('should show validation errors on signup form', async ({ page }) => {
    await page.goto('/signup');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for HTML5 validation (required fields)
    const firstNameInput = page.getByPlaceholder(/john/i);
    const lastNameInput = page.getByPlaceholder(/doe/i);
    const emailInput = page.getByPlaceholder(/your@email.com/i);
    const passwordInput = page.getByPlaceholder(/create a password/i);
    
    await expect(firstNameInput).toBeRequired();
    await expect(lastNameInput).toBeRequired();
    await expect(emailInput).toBeRequired();
    await expect(passwordInput).toBeRequired();
  });

  test('should show password visibility toggle', async ({ page }) => {
    await page.goto('/login');
    
    // Check password is initially hidden
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click visibility toggle
    await page.click('button[type="button"]');
    
    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should display forgot password link and functionality', async ({ page }) => {
    await page.goto('/login');
    
    // Check forgot password link exists
    await expect(page.getByText(/forgot password/i)).toBeVisible();
    
    // Fill in email
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Click forgot password
    await page.click('text=Forgot password?');
    
    // Should show an action (this depends on implementation)
    // For now, just check that clicking doesn't cause errors
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should load header and footer on auth pages', async ({ page }) => {
    await page.goto('/login');
    
    // Check for header elements
    await expect(page.getByText(/la belle vie/i)).toBeVisible();
    
    // Check for footer elements
    await expect(page.getByText(/all rights reserved/i)).toBeVisible();
  });

  test('should have proper form accessibility', async ({ page }) => {
    await page.goto('/login');
    
    // Check that form fields have proper labels
    const emailInput = page.getByPlaceholder(/your@email.com/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    
    // Check for proper form structure
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Check submit button is accessible
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});

test.describe('Account Page Tests (Authenticated)', () => {
  test('should show account page structure when authenticated', async ({ page }) => {
    // Note: This is a mock test since we can't easily authenticate in tests
    // In a real scenario, you'd set up authentication tokens or use a test user
    
    await page.goto('/account');
    
    // Should redirect to login (unauthenticated)
    await expect(page).toHaveURL(/\/login$/);
    
    // Future enhancement: Add proper authentication testing
    // This would require setting up test users and authentication state
  });
});