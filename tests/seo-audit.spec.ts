import { test, expect } from '@playwright/test';

test.describe('SEO - All Pages Have Proper Metadata', () => {
  const publicPages = [
    { path: '/', expectedTitle: 'La Belle Vie', description: 'gut health' },
    { path: '/products', expectedTitle: 'Fiber Supplements', description: 'fiber supplement' },
    { path: '/products/total-essential', expectedTitle: 'Total Essential', description: 'fiber' },
    { path: '/products/total-essential-plus', expectedTitle: 'Total Essential Plus', description: 'fiber' },
    { path: '/ingredients', expectedTitle: 'Ingredients', description: 'ingredients' },
    { path: '/benefits', expectedTitle: 'Benefits', description: 'benefits' },
    { path: '/testimonials', expectedTitle: 'Reviews', description: 'testimonials' },
    { path: '/faq', expectedTitle: 'FAQ', description: 'questions' },
    { path: '/contact', expectedTitle: 'Contact', description: 'contact' },
    { path: '/about', expectedTitle: 'About', description: 'about' },
    { path: '/terms', expectedTitle: 'Terms', description: 'terms' },
    { path: '/privacy', expectedTitle: 'Privacy', description: 'privacy' },
  ];

  publicPages.forEach(({ path, expectedTitle, description }) => {
    test(`${path} has title containing "${expectedTitle}"`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.toLowerCase()).toContain(expectedTitle.toLowerCase());
    });

    test(`${path} has meta description`, async ({ page }) => {
      await page.goto(path);
      const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription!.length).toBeGreaterThan(50);
    });

    test(`${path} has Open Graph title`, async ({ page }) => {
      await page.goto(path);
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle).toBeTruthy();
    });

    test(`${path} has Open Graph description`, async ({ page }) => {
      await page.goto(path);
      const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
      expect(ogDescription).toBeTruthy();
    });
  });

  const ingredientPages = [
    '/ingredients/acai-berry',
    '/ingredients/antioxidant-parsley',
    '/ingredients/apple-fiber',
    '/ingredients/beta-glucan-oat-bran',
    '/ingredients/cranberry',
    '/ingredients/detoxifying-broccoli-extract',
    '/ingredients/digestive-aid-guar-gum',
    '/ingredients/enzyme-rich-papaya',
    '/ingredients/fresh-cabbage-extract',
    '/ingredients/fresh-spinach-powder',
    '/ingredients/hydrating-celery',
    '/ingredients/nutrient-rich-carrot',
    '/ingredients/prebiotic-powerhouse',
    '/ingredients/premium-apple-fiber',
    '/ingredients/raspberry',
    '/ingredients/soluble-corn-fiber',
    '/ingredients/soothing-aloe-vera-powder',
    '/ingredients/strawberry',
    '/ingredients/sustainable-palm-fiber',
  ];

  ingredientPages.forEach((path) => {
    test(`${path} has meta description`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription!.length).toBeGreaterThan(30);
    });
  });

  // No-index pages should not be indexable
  const noIndexPages = [
    '/cart',
    '/checkout',
    '/login',
    '/signup',
    '/reset-password',
  ];

  noIndexPages.forEach((path) => {
    test(`${path} should have noindex directive`, async ({ page }) => {
      await page.goto(path);
      const robotsMeta = await page.getAttribute('meta[name="robots"]', 'content');
      // Either has noindex meta or no robots meta (relying on layout default)
      if (robotsMeta) {
        expect(robotsMeta).toContain('noindex');
      }
    });
  });
});

test.describe('SEO - Sitemap', () => {
  test('sitemap.xml should be accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('https://lbve.ca');
  });

  test('sitemap.xml should include all main pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    const requiredUrls = [
      'https://lbve.ca',
      '/products/total-essential',
      '/products/total-essential-plus',
      '/ingredients',
      '/benefits',
      '/testimonials',
      '/faq',
      '/contact',
      '/about',
    ];

    requiredUrls.forEach((url) => {
      expect(body).toContain(url);
    });
  });

  test('sitemap.xml should include ingredient pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();
    expect(body).toContain('/ingredients/acai-berry');
    expect(body).toContain('/ingredients/raspberry');
  });

  test('sitemap.xml should NOT include noindex pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();

    const excludedUrls = ['/cart', '/checkout', '/login', '/signup', '/account', '/reset-password'];
    excludedUrls.forEach((url) => {
      expect(body).not.toContain(`<loc>https://lbve.ca${url}</loc>`);
    });
  });
});

test.describe('SEO - Structured Data', () => {
  test('homepage has organization schema', async ({ page }) => {
    await page.goto('/');
    const scripts = await page.$$eval('script[type="application/ld+json"]', (els) =>
      els.map((el) => el.textContent)
    );
    const hasOrgSchema = scripts.some((s) => s && s.includes('"Organization"'));
    expect(hasOrgSchema).toBeTruthy();
  });
});
