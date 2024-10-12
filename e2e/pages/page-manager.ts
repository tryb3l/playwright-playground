import { Page } from '@playwright/test';
import { NavigationPage } from '@pages/navigation.page';
import { FormLayoutsPage } from '@pages/form-layouts.page';
import { DatePickerPage } from '@pages/date-picker.page';

class PageManager {
  private readonly navigationPage: NavigationPage;
  private readonly formLayoutsPage: FormLayoutsPage;
  private readonly datePickerPage: DatePickerPage;

  constructor(page: Page) {
    this.navigationPage = new NavigationPage(page);
    this.formLayoutsPage = new FormLayoutsPage(page);
    this.datePickerPage = new DatePickerPage(page);
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
}

export { PageManager };
