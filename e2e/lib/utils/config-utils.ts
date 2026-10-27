import { devices, PlaywrightTestConfig } from '@playwright/test';
import {
  appStartupTimeoutMs,
  createWebServerConfig,
  defaultBaseUrl,
} from '@utils/app-server';

const globalTimeoutMs = 30 * 60 * 1000;

const createBaseConfig = (isCI: boolean): Partial<PlaywrightTestConfig> => ({
  timeout: appStartupTimeoutMs,
  globalTimeout: isCI ? globalTimeoutMs : undefined,
  expect: {
    timeout: 10000,
  },
  testDir: 'e2e/tests',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: defaultBaseUrl,
    trace: 'retain-on-failure',
    actionTimeout: 60 * 1000,
    video: {
      mode: 'off',
      size: { width: 1280, height: 720 },
    },
    screenshot: 'only-on-failure',
  },
});

const createProjects = () => [
  {
    name: 'Chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'Firefox',
    use: { ...devices['Desktop Firefox'] },
  },
];

export { createBaseConfig, createProjects, createWebServerConfig };
