import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log(`Loaded URL from .env: ${process.env.URL}`);

export default defineConfig<PlaywrightTestConfig>({
  timeout: 100 * 1000,
  globalTimeout: 120 * 1000,
  expect: {
    timeout: 5000,
  },

  testDir: 'e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    trace: 'on-first-retry',
    actionTimeout: 20 * 1000,
    navigationTimeout: 60 * 1000,
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
    }
  ],
  webServer: {
    command: 'cd app && node --run start',
    port: 4200,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
