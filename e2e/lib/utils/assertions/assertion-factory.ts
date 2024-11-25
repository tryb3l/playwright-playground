import type { Page } from '@playwright/test';
import { FormAssertions } from './form-assertions';
import { DatePickerAssertions } from './datepicker-assertions';
import { TableAssertions } from './table-assertions';

export class AssertionsFactory {
  constructor(private page: Page) {}

  createFormAssertions() {
    return new FormAssertions(this.page);
  }

  createDatePickerAssertions() {
    return new DatePickerAssertions(this.page);
  }

  createTableAssertions() {
    return new TableAssertions(this.page);
  }
}
