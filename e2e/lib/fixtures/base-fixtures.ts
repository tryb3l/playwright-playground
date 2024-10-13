import { test as base } from '@playwright/test';
import { PageManager } from '@pages/page-manager';
import { StartPage } from '@fixtures/start-page.enum';
import { FormLayoutsPage } from '@pages/form-layouts.page';

export type TestOptions = {
  pageManager: PageManager;
  startPage: StartPage;
  formLayoutsPage: FormLayoutsPage;
};

export const test = base.extend<TestOptions>({
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
