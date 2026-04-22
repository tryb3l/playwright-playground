import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import { loadEnvFile } from 'node:process';
import path from 'path';
import {
  createBaseConfig,
  createProjects,
  createWebServerConfig,
} from '@utils/config-helpers';

const envFile = process.env.ENV_FILE || '.env.dev';

try {
  loadEnvFile(path.resolve(process.cwd(), envFile));
  console.log(`✅ Loaded environment from: ${envFile}`);
} catch {
  console.warn(
    `⚠️  Could not load ${envFile}. Ensure the file exists in the root.`
  );
}

const isCI = !!process.env.CI;

const config: PlaywrightTestConfig = {
  ...createBaseConfig(isCI),
  globalSetup: './global-setup.ts',
  projects: createProjects(),
  webServer: createWebServerConfig(isCI),
};

export default defineConfig(config);
