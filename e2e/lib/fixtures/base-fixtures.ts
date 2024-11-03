import { test as base, TestInfo } from '@playwright/test';
import { PageManager } from '@pages/page-manager';
import { StartPage } from '@fixtures/start-page.enum';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import { FormLayoutsPage } from '@pages/form-layouts.page';

export type TestOptions = {
  pageManager: PageManager;
  startPage: StartPage;
  formLayoutsPage: FormLayoutsPage;
  trackConsoleErrors: boolean;
  ignoreConsoleErrors: string[];
};

export const test = base.extend<TestOptions>({
  // Custom test options
  trackConsoleErrors: [true, { option: true }],
  ignoreConsoleErrors: [[], { option: true }],
  startPage: [StartPage.IoTDashboard, { option: true }],

  pageManager: async (
    { page, startPage, trackConsoleErrors, ignoreConsoleErrors },
    use,
    testInfo: TestInfo
  ) => {
    // Initialize ConsoleErrorsTracker if tracking is enabled
    let consoleErrorsTracker: ConsoleErrorsTracker | undefined;

    if (trackConsoleErrors) {
      consoleErrorsTracker = new ConsoleErrorsTracker(
        page,
        testInfo,
        ignoreConsoleErrors
      );
      consoleErrorsTracker.startTracking();
    }

    const pageManager = new PageManager(page);

    // Navigate to the starting page
    await page.goto('/');
    await pageManager.getNavigation().navigateToSection(startPage);

    await use(pageManager);

    // Stop tracking console errors after the test
    if (consoleErrorsTracker) {
      consoleErrorsTracker.stopTracking();
    }
  },

  formLayoutsPage: async ({ pageManager }, use) => {
    const formLayoutsPage = pageManager.getPage(FormLayoutsPage);
    await use(formLayoutsPage);
  },
});

export { expect } from '@playwright/test';
export { StartPage };
