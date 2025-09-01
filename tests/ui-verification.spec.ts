import { test, expect } from '@playwright/test';

test.describe('UI Verification Tests', () => {
  test('products dropdown functionality', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if products dropdown button exists
    const productsButton = page.getByTestId('products-dropdown');
    await expect(productsButton).toBeVisible();
    
    // Click the products dropdown
    await productsButton.click();
    
    // Check if dropdown menu appears
    const dropdownMenu = page.locator('[role="menu"]');
    await expect(dropdownMenu).toBeVisible();
    
    // Check if dropdown items are visible and clickable
    const totalEssentialLink = page.locator('text=Total Essential').first();
    const totalEssentialPlusLink = page.locator('text=Total Essential Plus');
    
    await expect(totalEssentialLink).toBeVisible();
    await expect(totalEssentialPlusLink).toBeVisible();
    
    // Test clicking a dropdown item
    await totalEssentialLink.click();
    await expect(page).toHaveURL(/\/products\/total-essential/);
  });

  test('hero content visibility and layout', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if hero section exists
    const heroSection = page.getByTestId('hero-section');
    await expect(heroSection).toBeVisible();
    
    // Check if hero content is visible
    const heroTitle = page.locator('h1').filter({ hasText: 'Restore Your Body' });
    await expect(heroTitle).toBeVisible();
    
    // Check if hero buttons are visible and clickable
    const totalEssentialButton = page.locator('text=Total Essential').first();
    const totalEssentialPlusButton = page.locator('text=Total Essential Plus').first();
    
    await expect(totalEssentialButton).toBeVisible();
    await expect(totalEssentialPlusButton).toBeVisible();
    
    // Check if hero content is not overlapping with header
    const header = page.locator('header');
    const headerBox = await header.boundingBox();
    const heroBox = await heroSection.boundingBox();
    
    if (headerBox && heroBox) {
      // Hero should start below the header
      expect(heroBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
    }
  });

  test('header and navigation z-index hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check header visibility
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Open products dropdown
    const productsButton = page.getByTestId('products-dropdown');
    await productsButton.click();
    
    // Check if dropdown appears above other content
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();
    
    // Verify dropdown doesn't get hidden behind other elements
    const dropdownBox = await dropdown.boundingBox();
    expect(dropdownBox).toBeTruthy();
    
    // Check if dropdown items are clickable (not hidden behind other elements)
    const firstDropdownItem = dropdown.locator('a').first();
    await expect(firstDropdownItem).toBeVisible();
    await expect(firstDropdownItem).toBeEnabled();
  });
});