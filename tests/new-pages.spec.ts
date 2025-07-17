import { test, expect } from '@playwright/test';

test.describe('New Pages Tests', () => {
  test('Contact page should load and display form', async ({ page }) => {
    await page.goto('/contact');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
    
    // Check for contact form
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Subject')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();
    
    // Check for contact information
    await expect(page.getByText('support@lbve.ca')).toBeVisible();
    await expect(page.getByText('1-800-555-FIBER')).toBeVisible();
  });

  test('About page should load and display company information', async ({ page }) => {
    await page.goto('/about');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: 'About La Belle Vie' })).toBeVisible();
    
    // Check for company philosophy
    await expect(page.getByText('We are the nature and the nature is us')).toBeVisible();
    
    // Check for mission section
    await expect(page.getByRole('heading', { name: 'Our Mission' })).toBeVisible();
    await expect(page.getByText('La Belle Vie focuses on creating all-natural')).toBeVisible();
  });

  test('Terms page should load and display terms content', async ({ page }) => {
    await page.goto('/terms');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: 'Terms and Conditions' })).toBeVisible();
    
    // Check for order section
    await expect(page.getByRole('heading', { name: 'Order & Payment' })).toBeVisible();
    
    // Check for shipping section
    await expect(page.getByText('🚚 Shipping')).toBeVisible();
    
    // Check for contact information
    await expect(page.getByText('admin@lbve.ca')).toBeVisible();
  });

  test('Privacy page should load and display privacy content', async ({ page }) => {
    await page.goto('/privacy');
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    
    // Check for information collection section
    await expect(page.getByRole('heading', { name: 'Information We Collect' })).toBeVisible();
    
    // Check for data security section
    await expect(page.getByRole('heading', { name: 'Data Security' })).toBeVisible();
  });

  test('Product pages should display testimonials', async ({ page }) => {
    await page.goto('/products/total-essential');
    
    // Check for testimonials section
    await expect(page.getByRole('heading', { name: 'What Our Customers Say' })).toBeVisible();
    
    // Check for at least one testimonial
    await expect(page.getByText('Celine C')).toBeVisible();
    
    // Check for star ratings (just check that star elements exist)
    await expect(page.locator('svg[class*="h-4 w-4"]')).toBeVisible();
  });

  test('Navigation includes new pages', async ({ page }) => {
    await page.goto('/');
    
    // Check desktop navigation (use first instance for strict mode)
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible();
    
    // Check footer navigation
    await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms & Conditions' })).toBeVisible();
  });
});