import { promises as fs } from 'fs';
import {
  test as base,
  TestInfo,
  BrowserContext,
  Page,
} from '@playwright/test';
import { PageManager } from '@pages/page-manager';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import { Users } from '@factories/users';
import { Authentication } from '@utils/auth';

export const test = base.extend<{
  pageManager: PageManager;
  user: {
    email: string;
    password: string;
  };
  authContext: BrowserContext;
  consoleErrorsTracker: ConsoleErrorsTracker;
}>({
  // Fixture for the authenticated browser context
  authContext: [
    async ({ browser }, use) => {
      const storageStatePath = 'playwright/.auth/user.json';

      let context: BrowserContext;

      if (process.env.REUSE_AUTH && (await fileExists(storageStatePath))) {
        // Reuse existing authentication state
        context = await browser.newContext({ storageState: storageStatePath });
      } else {
        // Create a new user and authenticate
        context = await browser.newContext();
        const users = new Users();

        // Generate user credentials
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

      // Cleanup
      await context.close();
    },
    { scope: 'worker' },
  ],

  // Fixture for the Page object
  page: async ({ authContext }, use) => {
    const page = await authContext.newPage();
    await use(page);
    await page.close();
  },

  // Fixture for the PageManager
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
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
        testInfo.error = new Error(`Console errors detected:\n${errors.join('\n')}`);
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