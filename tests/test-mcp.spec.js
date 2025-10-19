// Simple test to verify MCP integration
import { test, expect } from '@playwright/test';

test('MCP integration test', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if the page title is correct
  await expect(page).toHaveTitle(/La Belle Vie/);
  
  // Take a screenshot for MCP testing
  await page.screenshot({ path: 'mcp-test-screenshot.png' });
  
  console.log('MCP integration test completed successfully!');
});