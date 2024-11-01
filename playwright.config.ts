import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { createBaseConfig, createProjects, createWebServerConfig } from '@utils/config-helpers';

const envFile = process.env.ENV_FILE || '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });
console.log(`Loaded BASE_URL from ${envFile}: ${process.env.BASE_URL}`);

const isCI = !!process.env.CI;

const config: PlaywrightTestConfig = {
  ...createBaseConfig(isCI),
  projects: createProjects(),
  webServer: createWebServerConfig(isCI),
};

export default defineConfig(config);