import { promises as fs } from 'fs';
import {
  test as base,
  expect,
  TestInfo,
  BrowserContext,
  Page,
  test as coreTest,
} from '@playwright/test';
import { AuthPage } from '@pages/auth.page';
import { Users } from '@factories/users';
import { ensureAppServerReachable } from '@utils/app-server';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import { NetworkErrorsTracker } from '@utils/network-errors-tracker';
import {
  createConsoleErrorsTracker,
  createNetworkErrorsTracker,
  finalizeObservability,
} from '@utils/observability-report';

export const test = base.extend<{
  user: {
    email: string;
    password: string;
  };
  authContext: BrowserContext | undefined;
  consoleErrorsTracker: ConsoleErrorsTracker;
  networkErrorsTracker: NetworkErrorsTracker;
  observabilityReport: void;
}>({
  authenticated: [false, { scope: 'test' }],
  ignoreConsoleErrors: [],
  ignoreNetworkErrors: [],
  trackNetworkErrors: [true, { scope: 'test' }],
  failOnConsoleErrors: [true, { scope: 'test' }],
  failOnNetworkErrors: [false, { scope: 'test' }],
  strictNetwork: [false, { scope: 'test' }],
  statusCodesToIgnore: [],

  // Fixture for the authenticated browser context
  authContext: [
    async ({ browser, authenticated }, use) => {
      await coreTest.step('Authentication Setup', async () => {
        if (authenticated) {
          const storageStatePath = 'playwright/.auth/user.json';
          let context: BrowserContext;

          if (
            process.env.REUSE_AUTH === 'true' &&
            (await fileExists(storageStatePath))
          ) {
            context = await browser.newContext({
              storageState: storageStatePath,
            });
          } else {
            // Create a new user and authenticate
            context = await browser.newContext();
            const users = new Users();
            const { email, password } = await users.getUserCredentials();

            const page = await context.newPage();
            const authPage = new AuthPage(page);
            await ensureAppServerReachable();
            await authPage.loginThroughUi(email, password);
            await page.close();

            // Save storage state
            await context.storageState({ path: storageStatePath });
          }

          await use(context);
          await context.close();
        } else {
          await use(undefined);
        }
      });
    },
    { scope: 'test' },
  ],
  // Fixture for the Page object
  page: async ({ authContext, browser }, use) => {
    let page: Page;
    let localContext: BrowserContext | undefined;

    if (authContext) {
      page = await authContext.newPage();
    } else {
      localContext = await browser.newContext();
      page = await localContext.newPage();
    }

    await use(page);

    await page.close();
    if (localContext) {
      await localContext.close();
    }
  },

  // Fixture for the user credentials
  user: async ({}, use) => {
    const users = new Users();
    const { email, password } = await users.getUserCredentials();
    await use({ email, password });
  },

  consoleErrorsTracker: [
    async ({ page, ignoreConsoleErrors }, use) => {
      const tracker = createConsoleErrorsTracker(page, ignoreConsoleErrors);
      await use(tracker);
      tracker.stopTracking();
    },
    { auto: true },
  ],

  networkErrorsTracker: [
    async (
      {
        page,
        trackNetworkErrors,
        ignoreNetworkErrors,
        strictNetwork,
        statusCodesToIgnore,
      },
      use
    ) => {
      const tracker = createNetworkErrorsTracker(page, {
        trackNetworkErrors,
        ignoreNetworkErrors,
        strictNetwork,
        statusCodesToIgnore,
      });
      await use(tracker);
      tracker.stopTracking();
    },
    { auto: true },
  ],

  observabilityReport: [
    async (
      {
        consoleErrorsTracker,
        networkErrorsTracker,
        failOnConsoleErrors,
        failOnNetworkErrors,
      },
      use,
      testInfo: TestInfo
    ) => {
      await use();
      await finalizeObservability(
        testInfo,
        consoleErrorsTracker,
        networkErrorsTracker,
        {
          failOnConsoleErrors,
          failOnNetworkErrors,
        }
      );
    },
    { auto: true },
  ],
});

export { expect };

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
