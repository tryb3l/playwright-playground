import { devices, PlaywrightTestConfig } from '@playwright/test';

const defaultBaseUrl = process.env.BASE_URL || 'http://localhost:4200';
const shouldReuseExistingServer =
  process.env.REUSE_EXISTING_SERVER === 'true';
const appServeCommand =
  'node ./node_modules/@angular/cli/bin/ng.js serve --host localhost --port 4200';

const createBaseConfig = (isCI: boolean): Partial<PlaywrightTestConfig> => ({
  timeout: 180 * 1000,
  globalTimeout: 180 * 1000,
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

const createWebServerConfig = (isCI: boolean) => ({
  command: appServeCommand,
  cwd: './app',
  url: defaultBaseUrl,
  timeout: 180 * 1000,
  reuseExistingServer: !isCI && shouldReuseExistingServer,
});

export { createBaseConfig, createProjects, createWebServerConfig };
