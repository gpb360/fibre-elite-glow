import { test, expect } from '@playwright/test';

test.describe('Basic Page Access Tests', () => {
  const pages = [
    { path: '/', title: 'La Belle Vie' },
    { path: '/about', title: 'About La Belle Vie' },
    { path: '/contact', title: 'Contact Us' },
    { path: '/terms', title: 'Terms and Conditions' },
    { path: '/privacy', title: 'Privacy Policy' },
    { path: '/products/total-essential', title: 'Total Essential' },
    { path: '/products/total-essential-plus', title: 'Total Essential Plus' },
    { path: '/faq', title: 'FAQ' },
    { path: '/testimonials', title: 'Testimonials' },
    { path: '/benefits', title: 'Benefits' }
  ];

  pages.forEach(({ path, title }) => {
    test(`${path} should load without errors`, async ({ page }) => {
      const response = await page.goto(path);
      
      // Check that the page loads successfully
      expect(response?.status()).toBe(200);
      
      // Check that page title contains expected text
      const pageTitle = await page.title();
      expect(pageTitle).toContain(title);
      
      // Check that the page has loaded (no 404 content)
      await expect(page.getByText('Page not found')).not.toBeVisible();
      await expect(page.getByText('404')).not.toBeVisible();
    });
  });
});