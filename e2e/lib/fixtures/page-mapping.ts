import type { Page } from '@playwright/test';
import { FormLayoutsPage } from '@pages/form-layouts.page';
import { DatePickerPage } from '@pages/date-picker.page';
import { CalendarPage } from '@pages/calendar.page';
import { DashboardPage } from '@pages/dashboard.page';
import { DialogPage } from '@pages/dialog.page';
import { EchartsPage } from '@pages/echarts.page';
import { AuthPage } from '@pages/auth.page';
import { SmartTablePage } from '@pages/smart-table.page';
import { ToastrPage } from '@pages/toastr.page';
import { TreeGridPage } from '@pages/tree-grid.page';
import { WindowPage } from '@pages/window.page';
import { StartPage } from '@fixtures/start-page.enum';

type StartPageConstructor = new (page: Page) => object;

export const startPageClassMap = {
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

export type StartPageClassMap = typeof startPageClassMap;
export type StartPageKeys = keyof StartPageClassMap;
export { StartPage };
