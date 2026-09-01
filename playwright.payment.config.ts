import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'payment-hardening.spec.ts',
  fullyParallel: false,
  reporter: 'line',
  use: {},
});
