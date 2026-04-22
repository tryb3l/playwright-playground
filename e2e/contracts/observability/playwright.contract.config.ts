import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'observability.contract.subject.test.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  reporter: [['./contract-reporter.ts']],
  use: {
    ...devices['Desktop Chrome'],
    screenshot: 'off',
    trace: 'off',
    video: 'off',
  },
});