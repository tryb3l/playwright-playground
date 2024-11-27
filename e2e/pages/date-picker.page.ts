import { expect, Page } from 'playwright/test';
import { DatePickerComponent } from '@components/date-picker/date-picker.component';

class DatePickerPage {
  private datePickerComponent: DatePickerComponent;

  constructor(page: Page) {
    this.datePickerComponent = new DatePickerComponent(page);
  }

  async selectCommonDateFromToday(daysFromToday: number): Promise<void> {
    await this.datePickerComponent.selectCommonDatepickerDateFromToday(
      daysFromToday
    );
  }

  async selectDateRangeFromToday(
    daysFromToday: number,
    daysAfter: number
  ): Promise<void> {
    await this.datePickerComponent.selectDatePickerRangeFromToday(
      daysFromToday,
      daysAfter
    );
  }
}

export { DatePickerPage };
