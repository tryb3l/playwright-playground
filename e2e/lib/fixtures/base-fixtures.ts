import { promises as fs } from 'fs';
import {
  test as base,
  expect,
  TestInfo,
  BrowserContext,
  Page,
  test as coreTest,
} from '@playwright/test';
import { PageManager } from '@pages/page-manager';
import { AuthPage } from '@pages/auth.page';
import { Users } from '@factories/users';
import { AssertionsFactory } from '@utils/assertions/assertion-factory';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import { NetworkErrorsTracker } from '@utils/network-errors-tracker';
import { attachObservabilityReport } from '@utils/observability-report';

const defaultNetworkIgnorePatterns = [
  '/assets/',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.css',
  '.js',
  '.woff',
  '.woff2',
  '.map',
  'favicon.ico',
  'p.scdn.co',
];

export const test = base.extend<{
  pageManager: PageManager;
  user: {
    email: string;
    password: string;
  };
  authContext: BrowserContext | undefined;
  consoleErrorsTracker: ConsoleErrorsTracker;
  networkErrorsTracker: NetworkErrorsTracker;
  assertions: AssertionsFactory;
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

          if (process.env.REUSE_AUTH && (await fileExists(storageStatePath))) {
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

  // Fixture for the PageManager
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },

  assertions: async ({ page }, use) => {
    const assertions = new AssertionsFactory(page);
    await use(assertions);
  },

  // Fixture for the user credentials
  user: async ({}, use) => {
    const users = new Users();
    const { email, password } = await users.getUserCredentials();
    await use({ email, password });
  },

  // Automatic fixture for console error tracking
  consoleErrorsTracker: [
    async ({ page, ignoreConsoleErrors }, use) => {
      const consoleErrorsTracker = new ConsoleErrorsTracker(
        page,
        ignoreConsoleErrors,
        { maxErrors: 50 }
      );
      consoleErrorsTracker.startTracking();

      await use(consoleErrorsTracker);

      consoleErrorsTracker.stopTracking();
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
      const safeIgnoreNetworkErrors = ignoreNetworkErrors ?? [];
      const effectiveIgnorePatterns = strictNetwork
        ? safeIgnoreNetworkErrors
        : [...defaultNetworkIgnorePatterns, ...safeIgnoreNetworkErrors];

      const networkErrorsTracker = new NetworkErrorsTracker(page, {
        maxErrors: 50,
        ignorePatterns: effectiveIgnorePatterns,
        statusCodesToIgnore,
        trackResponses: trackNetworkErrors,
        trackRequestFailures: trackNetworkErrors,
      });

      if (trackNetworkErrors) {
        networkErrorsTracker.startTracking();
      }

      await use(networkErrorsTracker);

      if (trackNetworkErrors) {
        networkErrorsTracker.stopTracking();
      }
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
      consoleErrorsTracker.stopTracking();
      networkErrorsTracker.stopTracking();

      await attachObservabilityReport(
        testInfo,
        consoleErrorsTracker,
        networkErrorsTracker
      );

      if (testInfo.status !== testInfo.expectedStatus) {
        return;
      }

      const consoleErrors = consoleErrorsTracker.getErrors();
      if (failOnConsoleErrors) {
        expect(
          consoleErrors,
          consoleErrors.length
            ? `Unexpected console errors:\n${consoleErrorsTracker.getErrorsAsText()}`
            : undefined
        ).toHaveLength(0);
      }

      const networkErrors = networkErrorsTracker.getErrors();
      if (failOnNetworkErrors) {
        expect(
          networkErrors,
          networkErrors.length
            ? `Unexpected network errors:\n${networkErrorsTracker.getErrorsAsText()}`
            : undefined
        ).toHaveLength(0);
      }
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
