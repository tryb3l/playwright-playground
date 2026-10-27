import type { Page } from '@playwright/test';
import { expect, test as base } from '@fixtures/base-fixtures';
import { NavigationComponent } from '@components/navbar/navigation.component';
import { AuthPage } from '@pages/auth.page';
import { CalendarPage } from '@pages/calendar.page';
import { DashboardPage } from '@pages/dashboard.page';
import { DatePickerPage } from '@pages/date-picker.page';
import { DialogPage } from '@pages/dialog.page';
import { EchartsPage } from '@pages/echarts.page';
import { FormLayoutsPage } from '@pages/form-layouts.page';
import { SmartTablePage } from '@pages/smart-table.page';
import { ToastrPage } from '@pages/toastr.page';
import { TreeGridPage } from '@pages/tree-grid.page';
import { WindowPage } from '@pages/window.page';

enum StartPage {
  IoTDashboard = 'IoT Dashboard',
  FormLayouts = 'Forms > Form Layouts',
  DatePicker = 'Forms > Datepicker',
  Dialog = 'Modal & Overlays > Dialog',
  Window = 'Modal & Overlays > Window',
  Toastr = 'Modal & Overlays > Toastr',
  Calendar = 'Extra Components > Calendar',
  Echarts = 'Charts > Echarts',
  SmartTable = 'Tables & Data > Smart Table',
  TreeGrid = 'Tables & Data > Tree Grid',
  Login = 'Auth > Login',
  Register = 'Auth > Register',
  RequestPassword = 'Auth > Request Password',
  ResetPassword = 'Auth > Reset Password',
}

type StartPageConstructor = new (page: Page) => object;

const startPageRegistry = {
  [StartPage.IoTDashboard]: DashboardPage,
  [StartPage.FormLayouts]: FormLayoutsPage,
  [StartPage.DatePicker]: DatePickerPage,
  [StartPage.Calendar]: CalendarPage,
  [StartPage.Dialog]: DialogPage,
  [StartPage.Echarts]: EchartsPage,
  [StartPage.SmartTable]: SmartTablePage,
  [StartPage.TreeGrid]: TreeGridPage,
  [StartPage.Window]: WindowPage,
  [StartPage.Toastr]: ToastrPage,
  [StartPage.Login]: AuthPage,
  [StartPage.Register]: AuthPage,
  [StartPage.RequestPassword]: AuthPage,
  [StartPage.ResetPassword]: AuthPage,
} satisfies Record<StartPage, StartPageConstructor>;

type StartPageKeys = keyof typeof startPageRegistry;
type PageObjectOf<T extends StartPageKeys> = InstanceType<
  (typeof startPageRegistry)[T]
>;

interface CustomFixtures<T extends StartPageKeys> {
  pageObject: PageObjectOf<T>;
  startPageReady: void;
}

function createTestForStartPage<T extends StartPageKeys>(startPage: T) {
  return base.extend<CustomFixtures<T>>({
    startPageReady: [
      async ({ page }, use) => {
        await page.goto('/');
        await new NavigationComponent(page).navigateToSection(startPage);
        await use();
      },
      { auto: true },
    ],
    pageObject: async ({ page }, use) => {
      const PageClass = startPageRegistry[startPage];
      const pageObject = new PageClass(page);
      await use(pageObject as PageObjectOf<T>);
    },
  });
}

export { createTestForStartPage, expect, StartPage };
