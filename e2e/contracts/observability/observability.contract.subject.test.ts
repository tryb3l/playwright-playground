import type { Page } from '@playwright/test';
import { expect, test } from '@fixtures/base-fixtures';

async function prepareContractPage(page: Page): Promise<void> {
  await page.setContent('<main>observability contract</main>');
}

async function triggerConsoleNoise(page: Page, label: string): Promise<void> {
  await prepareContractPage(page);
  await page.evaluate((value) => {
    console.error(`observability-contract:${value}`);
  }, label);
}

async function triggerNetworkNoise(page: Page, label: string): Promise<void> {
  const url = `https://observability.contract.invalid/${label}`;

  await page.route(url, async (route) => {
    await route.abort('failed');
  });

  await prepareContractPage(page);
  await page.evaluate(async (value) => {
    try {
      await fetch(value, { mode: 'no-cors' });
    } catch {
      // Contract subject intentionally triggers a failed request.
    }
  }, url);

  await page.unroute(url);
}

test.describe('Observability contract subjects', () => {
  test.describe('soft policy', () => {
    test.use({
      failOnConsoleErrors: false,
      failOnNetworkErrors: false,
      strictNetwork: true,
    });

    test('soft observability noise stays soft', async ({
      page,
      consoleErrorsTracker,
      networkErrorsTracker,
    }) => {
      await triggerConsoleNoise(page, 'soft');
      await triggerNetworkNoise(page, 'soft');

      await expect
        .poll(() => consoleErrorsTracker.getErrors().length)
        .toBeGreaterThan(0);
      await expect
        .poll(() => networkErrorsTracker.getErrors().length)
        .toBeGreaterThan(0);
    });

    test('ordinary failures stay ordinary with observability noise', async ({
      page,
      consoleErrorsTracker,
      networkErrorsTracker,
    }) => {
      await triggerConsoleNoise(page, 'ordinary-failure');
      await triggerNetworkNoise(page, 'ordinary-failure');

      await expect
        .poll(() => consoleErrorsTracker.getErrors().length)
        .toBeGreaterThan(0);
      await expect
        .poll(() => networkErrorsTracker.getErrors().length)
        .toBeGreaterThan(0);

      expect(1, 'primary assertion should remain the failure source').toBe(2);
    });
  });

  test.describe('hard console policy', () => {
    test.use({
      trackNetworkErrors: false,
      failOnConsoleErrors: true,
      failOnNetworkErrors: false,
    });

    test('console policy can hard fail an otherwise passing test', async ({
      page,
      consoleErrorsTracker,
    }) => {
      await triggerConsoleNoise(page, 'hard-console');

      await expect
        .poll(() => consoleErrorsTracker.getErrors().length)
        .toBeGreaterThan(0);
    });
  });

  test.describe('hard network policy', () => {
    test.use({
      failOnConsoleErrors: false,
      failOnNetworkErrors: true,
      strictNetwork: true,
    });

    test('network policy can hard fail an otherwise passing test', async ({
      page,
      networkErrorsTracker,
    }) => {
      await triggerNetworkNoise(page, 'hard-network');

      await expect
        .poll(() => networkErrorsTracker.getErrors().length)
        .toBeGreaterThan(0);
    });
  });
});