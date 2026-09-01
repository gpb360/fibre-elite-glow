import { expect, test } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ALL_PUBLIC_ROUTES = [
  '/',
  '/about',
  '/benefits',
  '/contact',
  '/faq',
  '/ingredients',
  '/privacy',
  '/products',
  '/products/total-essential',
  '/products/total-essential-plus',
  '/terms',
  '/testimonials',
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
] as const;

const PUBLIC_ROUTES: readonly string[] = process.env.IMAGE_TEST_ROUTE
  ? [process.env.IMAGE_TEST_ROUTE]
  : ALL_PUBLIC_ROUTES;

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(entryPath);
    }

    return /\.(?:css|ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  }));

  return files.flat();
}

test('every literal public image reference resolves to a tracked asset', async () => {
  const repositoryRoot = process.cwd();
  const files = [
    ...(await sourceFiles(path.join(repositoryRoot, 'app'))),
    ...(await sourceFiles(path.join(repositoryRoot, 'src'))),
  ];
  const assetPattern = /["'](\/(?:assets|images|lovable-uploads)\/[^"']+)["']/g;
  const missing: string[] = [];

  for (const file of files) {
    const source = await readFile(file, 'utf8');

    for (const match of source.matchAll(assetPattern)) {
      const assetPath = path.join(repositoryRoot, 'public', ...match[1].split('/').filter(Boolean));

      try {
        await readFile(assetPath);
      } catch {
        missing.push(`${path.relative(repositoryRoot, file)} -> ${match[1]}`);
      }
    }
  }

  expect(missing, `Missing public assets:\n${missing.join('\n')}`).toEqual([]);
});

test('mixed-case public asset paths are served without route normalization', async ({ request }) => {
  const response = await request.get('/assets/webp/16x9_A_cluster_of_acai_berries.webp');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/webp');
});

test('all public routes render without broken images', async ({ page }) => {
  test.setTimeout(360_000);
  const failures: string[] = [];

  // First-hit Next.js development compilation is intentionally exercised one
  // route at a time. Parallel compilation can corrupt the development cache and
  // produce false 404/500 results that do not occur in production builds.
  for (const route of PUBLIC_ROUTES) {
    const failedRequests = new Set<string>();
    const onResponse = (response: import('@playwright/test').Response) => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) {
        failedRequests.add(`${response.status()} ${response.url()}`);
      }
    };
    const onRequestFailed = (request: import('@playwright/test').Request) => {
      if (request.resourceType() === 'image') {
        failedRequests.add(`request failed ${request.url()}`);
      }
    };

    page.on('response', onResponse);
    page.on('requestfailed', onRequestFailed);

    try {
      const response = await page.goto(route, {
        waitUntil: 'domcontentloaded',
        timeout: 45_000,
      });
      if (response?.status() !== 200) {
        failures.push(`${route} returned HTTP ${response?.status() ?? 'no response'}`);
        continue;
      }

      await page.evaluate(async () => {
        const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

        for (let y = 0; y < document.body.scrollHeight; y += Math.max(window.innerHeight * 0.75, 400)) {
          window.scrollTo(0, y);
          await wait(75);
        }

        window.scrollTo(0, document.body.scrollHeight);
        await wait(150);
      });

      await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete), undefined, {
        timeout: 5_000,
      }).catch(() => undefined);

      const brokenImages = await page.locator('img').evaluateAll((images) => images
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.getAttribute('src') || '<missing src>')
      );

      for (const image of brokenImages) {
        failures.push(`${route} rendered broken image ${image}`);
      }
      for (const requestFailure of failedRequests) {
        failures.push(`${route} image request ${requestFailure}`);
      }
    } catch (error) {
      failures.push(`${route} image verification error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      page.off('response', onResponse);
      page.off('requestfailed', onRequestFailed);
    }
  }

  expect(failures, `Rendered image failures:\n${failures.join('\n')}`).toEqual([]);
});

test('product detail links use the deployed route slugs', async ({ page }) => {
  await page.goto('/products');

  const detailLinks = page.getByRole('link', { name: 'View Details' });
  await expect(detailLinks).toHaveCount(2);
  await expect(detailLinks.nth(0)).toHaveAttribute('href', '/products/total-essential');
  await expect(detailLinks.nth(1)).toHaveAttribute('href', '/products/total-essential-plus');
});
