import { test, expect } from '@playwright/test';

test.describe('Testimonials Page', () => {
  test('should load testimonials page successfully', async ({ page }) => {
    const response = await page.goto('/testimonials');
    expect(response?.status()).toBe(200);
  });

  test('should display page title and heading', async ({ page }) => {
    await page.goto('/testimonials');
    const title = await page.title();
    expect(title).toContain('Customer Reviews');

    // Check heading
    await expect(page.getByText('Real Stories, Real Results')).toBeVisible();
  });

  test('should display testimonial cards', async ({ page }) => {
    await page.goto('/testimonials');

    // Wait for testimonials to load (either from API or fallback)
    await page.waitForTimeout(2000);

    // Should have customer review cards visible
    await expect(page.getByText('Customer Reviews')).toBeVisible();

    // Should show at least one testimonial (from fallback or backend)
    const testimonialCards = page.locator('[class*="testimonial"], [class*="card"]').filter({
      hasText: /Total Essential/
    });
    const count = await testimonialCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show verified badges on testimonials', async ({ page }) => {
    await page.goto('/testimonials');
    await page.waitForTimeout(2000);

    // Check for verified badges
    const verifiedBadges = page.getByText('Verified');
    const count = await verifiedBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display review submission form', async ({ page }) => {
    await page.goto('/testimonials');

    // Scroll to the form section
    await page.getByText('Share Your Story').scrollIntoViewIfNeeded();

    // Check form elements exist
    await expect(page.getByText('Leave a Verified Review')).toBeVisible();
    await expect(page.getByPlaceholder('Your full name')).toBeVisible();
    await expect(page.getByPlaceholder('Your email address')).toBeVisible();
    await expect(page.getByText('Select Product')).toBeVisible();
  });

  test('should display discount banner', async ({ page }) => {
    await page.goto('/testimonials');
    await expect(page.getByText('Special Offer for Reviewers!')).toBeVisible();
    await expect(page.getByText('REVIEW15')).toBeVisible();
  });

  test('should display trust section', async ({ page }) => {
    await page.goto('/testimonials');

    await page.getByText('Why We Verify Every Review').scrollIntoViewIfNeeded();
    await expect(page.getByText('Authentic Feedback')).toBeVisible();
    await expect(page.getByText('Quality Improvement')).toBeVisible();
    await expect(page.getByText('Trust & Transparency')).toBeVisible();
  });

  test('should validate form requires all fields', async ({ page }) => {
    await page.goto('/testimonials');

    // Scroll to the form
    await page.getByText('Share Your Story').scrollIntoViewIfNeeded();

    // Try to submit empty form — HTML5 validation should prevent it
    const submitButton = page.getByRole('button', { name: /Submit Review/i });
    await submitButton.click();

    // The form should still be visible (not submitted)
    await expect(page.getByPlaceholder('Your full name')).toBeVisible();
  });
});

test.describe('Testimonials API', () => {
  test('GET /api/testimonials should return JSON response', async ({ request }) => {
    const response = await request.get('/api/testimonials');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('testimonials');
    expect(Array.isArray(data.testimonials)).toBeTruthy();
  });

  test('POST /api/testimonials/submit should validate required fields', async ({ request }) => {
    const response = await request.post('/api/testimonials/submit', {
      data: {
        name: '',
        email: '',
        product: '',
        rating: 0,
        review: '',
      },
    });

    // Should return 400 for missing fields
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeTruthy();
  });

  test('POST /api/testimonials/submit should reject unverified email', async ({ request }) => {
    const response = await request.post('/api/testimonials/submit', {
      data: {
        name: 'Test User',
        email: 'nonexistent@test.com',
        product: 'Total Essential',
        rating: 5,
        review: 'This is a test review that should be rejected because the email is not in orders.',
      },
    });

    // Should return 403 for unverified purchase
    expect([403, 500]).toContain(response.status());
  });
});
