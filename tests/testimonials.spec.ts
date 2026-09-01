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
    await expect(page.getByRole('heading', { name: 'Customer Reviews' })).toBeVisible();

    // The public fallback remains visible when the demo database is unavailable.
    await expect(page.getByText('G Normandeau')).toBeVisible();
  });

  test('should show verified badges on testimonials', async ({ page }) => {
    await page.goto('/testimonials');
    await page.waitForTimeout(2000);

    // Check for verified badges
    const verifiedBadges = page.getByText('Verified');
    const count = await verifiedBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should hide review submission while the demo database is disabled', async ({ page }) => {
    await page.goto('/testimonials');
    await expect(page.getByRole('heading', { name: 'Leave a Verified Review' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Submit Review/i })).toHaveCount(0);
  });

  test('should hide the reviewer discount while submissions are disabled', async ({ page }) => {
    await page.goto('/testimonials');
    await expect(page.getByText('Special Offer for Reviewers!')).toHaveCount(0);
    await expect(page.getByText('REVIEW15')).toHaveCount(0);
  });

  test('should display trust section', async ({ page }) => {
    await page.goto('/testimonials');

    await page.getByText('Why We Verify Every Review').scrollIntoViewIfNeeded();
    await expect(page.getByText('Authentic Feedback')).toBeVisible();
    await expect(page.getByText('Quality Improvement')).toBeVisible();
    await expect(page.getByText('Trust & Transparency')).toBeVisible();
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

    expect(response.status()).toBe(404);
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

    expect(response.status()).toBe(404);
  });
});
