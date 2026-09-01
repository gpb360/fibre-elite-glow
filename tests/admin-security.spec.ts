import { expect, test } from '@playwright/test';

const forgedHeader = { 'x-admin-auth': 'true' };

test.describe('admin session boundary', () => {
  test('rejects a forged client header on every service-role admin route', async ({ request }) => {
    for (const path of [
      '/api/admin/orders',
      '/api/admin/affiliates',
      '/api/admin/testimonials',
    ]) {
      const response = await request.get(path, { headers: forgedHeader });
      expect(response.status(), path).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
    }
  });

  test('rejects a forged client header before inventory mutation', async ({ request }) => {
    const response = await request.post('/api/inventory', {
      headers: forgedHeader,
      data: {
        operations: [
          {
            packageId: '11111111-1111-4111-8111-111111111111',
            operation: 'set',
            quantity: 0,
          },
        ],
      },
    });

    expect(response.status()).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  test('creates, verifies, and clears a signed HttpOnly admin session', async ({ request }) => {
    const rejected = await request.post('/api/admin/session', {
      data: { password: 'not-the-password' },
    });
    expect(rejected.status()).toBe(401);

    const login = await request.post('/api/admin/session', {
      data: { password: 'test-admin-password' },
    });
    expect(login.status()).toBe(200);
    expect(login.headers()['set-cookie']).toContain('lbve_admin_session=');
    expect(login.headers()['set-cookie']).toContain('HttpOnly');
    expect(login.headers()['set-cookie']).toContain('SameSite=strict');

    const verified = await request.get('/api/admin/session');
    await expect(verified.json()).resolves.toEqual({ authenticated: true });

    const logout = await request.delete('/api/admin/session');
    expect(logout.status()).toBe(200);

    const cleared = await request.get('/api/admin/session');
    await expect(cleared.json()).resolves.toEqual({ authenticated: false });
  });

  test('admin page uses the server session rather than browser storage', async ({ page }) => {
    await page.goto('/admin');

    await expect(page.getByRole('heading', { name: 'Admin Access' })).toBeVisible();
    await page.getByLabel('Password:').fill('test-admin-password');
    await page.getByRole('button', { name: 'Access Dashboard' }).click();

    await expect(page.getByText('Admin Dashboard', { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('admin-auth'))).toBeNull();

    await page.reload();
    await expect(page.getByText('Admin Dashboard', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Admin Access' })).toBeVisible();
  });
});

test.describe('development diagnostics boundary', () => {
  test('diagnostic routes require the signed admin session in development', async ({ request }) => {
    const probes = [
      request.post('/api/test-email', { data: { customerEmail: 'nobody@example.com' } }),
      request.get('/api/test-admin-email'),
      request.get('/api/test-simple-email'),
      request.get('/api/test-webhook-email'),
      request.post('/api/webhook-test', { data: { example: 'do-not-log-me' } }),
      request.get('/api/webhook-test'),
      request.post('/api/webhooks/test', { data: { example: 'do-not-log-me' } }),
      request.post('/api/recover-payment', { data: {} }),
      request.post('/api/verify-transaction', { data: {} }),
      request.post('/api/confirm-user', { data: {} }),
    ];

    for (const responsePromise of probes) {
      const response = await responsePromise;
      expect(response.status()).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
    }
  });
});
