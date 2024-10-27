import { test as base, ConsoleMessage } from '@playwright/test';
import { PageManager } from '@pages/page-manager';
import { StartPage } from '@fixtures/start-page.enum';
import { FormLayoutsPage } from '@pages/form-layouts.page';

export type TestOptions = {
  pageManager: PageManager;
  startPage: StartPage;
  formLayoutsPage: FormLayoutsPage;
};

export const test = base.extend<TestOptions & { trackConsoleErrors: boolean }>({
  trackConsoleErrors: [true, { option: true }],
  page: async ({ page, trackConsoleErrors }, use, testInfo) => {
    const errors: string[] = [];

    if (trackConsoleErrors) {
      const listener = (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      };
      page.on('console', listener);
      await use(page);

      page.off('console', listener);

      if (errors.length > 0) {
        await testInfo.attach('Console Errors', {
          body: errors.join('\n'),
          contentType: 'text/plain',
        });

        testInfo.status = 'failed';
        testInfo.error = new Error(
          `Console errors detected: \n${errors.join('\n')}`
        );
      }
    } else {
      await use(page);
    }
  },

  startPage: [StartPage.IoTDashboard, { option: true }],
  pageManager: async ({ page, startPage }, use) => {
    const pageManager = new PageManager(page);
    await page.goto('/');
    await pageManager.getNavigation().navigateToSection(startPage);
    await use(pageManager);
  },

  formLayoutsPage: async ({ pageManager }, use) => {
    const formLayoutsPage = pageManager.getPage(FormLayoutsPage);
    await use(formLayoutsPage);
  },
});

export { StartPage };
