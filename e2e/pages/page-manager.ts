// e2e/pages/page-manager.ts

import { Page } from '@playwright/test';
import { NavigationPage } from '@pages/navigation.page';
import { FormLayoutsPage } from '@pages/form-layouts.page';
import { DatePickerPage } from '@pages/date-picker.page';
//import { ToastrPage } from '@pages/toastr.page';
//import { SmartTablePage } from '@pages/smart-table.page';
//import { IoTDashboardPage } from '@pages/iot-dashboard.page';

class PageManager {
  private readonly navigationPage: NavigationPage;
  private readonly formLayoutsPage: FormLayoutsPage;
  private readonly datePickerPage: DatePickerPage;
  //private readonly toastrPage: ToastrPage;
  //private readonly smartTablePage: SmartTablePage;
  //private readonly iotDashboardPage: IoTDashboardPage;

  constructor(page: Page) {
    this.navigationPage = new NavigationPage(page);
    this.formLayoutsPage = new FormLayoutsPage(page);
    this.datePickerPage = new DatePickerPage(page);
    //this.toastrPage = new ToastrPage(page);
    //this.smartTablePage = new SmartTablePage(page);
    //this.iotDashboardPage = new IoTDashboardPage(page);
  }

  navigateTo() {
    return this.navigationPage;
  }

  onFormLayoutsPage() {
    return this.formLayoutsPage;
  }

  onDatePickerPage() {
    return this.datePickerPage;
  }

  // onToastrPage() {
  //   return this.toastrPage;
  // }

  // onSmartTablePage() {
  //   return this.smartTablePage;
  // }

  // onIoTDashboardPage() {
  //   return this.iotDashboardPage;
  // }
}

export { PageManager };
