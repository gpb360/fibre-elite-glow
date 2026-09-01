import { defineConfig } from '@playwright/test';

const port = 3107;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: 'line',
  use: { baseURL },
  webServer: {
    command: `pnpm exec next dev -p ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      ADMIN_PASSWORD: 'test-admin-password',
      ADMIN_SESSION_SECRET: 'test-admin-session-secret',
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:9',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      RESEND_API_KEY: '',
      ADMIN_EMAIL: 'nobody@example.invalid',
      STRIPE_SECRET_KEY: '',
      STRIPE_WEBHOOK_SECRET: '',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
});
