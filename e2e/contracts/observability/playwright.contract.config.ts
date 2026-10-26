import os from 'node:os';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'observability.contract.subject.test.ts',
  outputDir: path.join(os.tmpdir(), 'playwright-observability-contract-results'),
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