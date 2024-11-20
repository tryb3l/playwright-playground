import { promises as fs } from 'fs';
import { test as base, TestInfo, BrowserContext, Page } from '@playwright/test';
import { PageManager } from '@pages/page-manager';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import { Users } from '@factories/users';
import { Authentication } from '@utils/auth';
import { AssertionsFactory } from '@utils/assertions/assertion-factory'

export const test = base.extend<{
  pageManager: PageManager;
  user: {
    email: string;
    password: string;
  };
  authContext: BrowserContext | undefined;
  consoleErrorsTracker: ConsoleErrorsTracker;
  assertions: AssertionsFactory;
}>({
  // Define the custom option with default value
  authenticated: [false, { option: true }],
  ignoreConsoleErrors: [[], { option: true }],

  // Fixture for the authenticated browser context
  authContext: [
    async ({ browser, authenticated }, use) => {
      if (authenticated) {
        const storageStatePath = 'playwright/.auth/user.json';
        let context: BrowserContext;

        if (process.env.REUSE_AUTH && (await fileExists(storageStatePath))) {
          // Reuse existing authentication state
          context = await browser.newContext({
            storageState: storageStatePath,
          });
        } else {
          // Create a new user and authenticate
          context = await browser.newContext();
          const users = new Users();
          const { email, password } = await users.getUserCredentials();

          // Perform authentication steps
          const page = await context.newPage();
          const auth = new Authentication(page);
          await auth.loginUser(email, password);
          await page.close();

          // Save storage state
          await context.storageState({ path: storageStatePath });
        }

        await use(context);
        await context.close();
      } else {
        // For unauthenticated tests, do not create authContext
        await use(undefined);
      }
    },
    { scope: 'test' },
  ],

  // Fixture for the Page object
  page: async ({ authContext, browser }, use) => {
    let page;
    if (authContext) {
      page = await authContext.newPage();
    } else {
      const context = await browser.newContext();
      page = await context.newPage();
    }
    await use(page);
    await page.close();
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
    // Cleanup if necessary
    // await users.deleteUser(email);
  },

  // Automatic fixture for console error tracking
  consoleErrorsTracker: [
    async ({ page }, use, testInfo: TestInfo) => {
      // Retrieve ignore patterns from test info
      const ignoreConsoleErrors =
        testInfo.project.use.ignoreConsoleErrors || [];

      const consoleErrorsTracker = new ConsoleErrorsTracker(
        page,
        ignoreConsoleErrors
      );
      consoleErrorsTracker.startTracking();

      await use(consoleErrorsTracker);

      consoleErrorsTracker.stopTracking();

      // If there are errors, attach them to the test report
      const errors = consoleErrorsTracker.getErrors();
      if (errors.length > 0) {
        await testInfo.attach('Console Errors', {
          body: errors.join('\n'),
          contentType: 'text/plain',
        });
        // Optionally, fail the test if console errors are detected
        testInfo.status = 'failed';
        testInfo.error = new Error(
          `Console errors detected:\n${errors.join('\n')}`
        );
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';

// Helper function to check if a file exists
async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
