import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log(`Loaded URL from .env: ${process.env.URL}`);

export default defineConfig<PlaywrightTestConfig>({
  timeout: 40000,
  globalTimeout: 600000,
  expect: {
    timeout: 5000,
  },

  testDir: 'e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.URL || 'http://localhost:4200',
    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 30000,
    video: {
      mode: 'off',
      size: { width: 1280, height: 720 },
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'make run-app',
    port: 4200,
    reuseExistingServer: !process.env.CI,
  },
});
