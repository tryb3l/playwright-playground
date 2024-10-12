import { test as base } from '@playwright/test';
import { PageManager } from '@pages/page-manager';
import { FormLayoutsPage } from '@pages/form-layouts.page';

enum StartPage {
  IoTDashboard = 'IoT Dashboard',
  FormLayouts = 'Form Layouts',
  DatePicker = 'Date Picker',
  Toastr = 'Toastr',
  SmartTable = 'Smart Table',
  //TODO add more pages
}

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

    const navigationActions: { [key in StartPage]: () => Promise<void> } = {
      [StartPage.FormLayouts]: () => pageManager.navigateTo().formLayoutPage(),
      [StartPage.DatePicker]: () => pageManager.navigateTo().datepickerPage(),
      [StartPage.Toastr]: () => pageManager.navigateTo().toastrPage(),
      [StartPage.SmartTable]: () => pageManager.navigateTo().smartTablePage(),
      [StartPage.IoTDashboard]: () =>
        pageManager.navigateTo().iotDashboardPage(),
    };

    await navigationActions[startPage]();

    await use(pageManager);
  },
  formLayoutsPage: async ({ pageManager }, use) => {
    await use(pageManager.onFormLayoutsPage());
  },
});

export { StartPage };
