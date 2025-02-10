import { Page } from '@playwright/test';
import { DatePickerComponent } from '@components/date-picker/date-picker.component';

class DatePickerPage {
  private _datePickerComponent: DatePickerComponent | undefined;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  private get datePickerComponent(): DatePickerComponent {
    if (!this._datePickerComponent) {
      this._datePickerComponent = new DatePickerComponent(this.page);
    }
    return this._datePickerComponent
  }

  async selectCommonDateFromToday(daysFromToday: number): Promise<void> {
    await this.datePickerComponent.selectCommonDatepickerDateFromToday(
      daysFromToday
    );
  }

  async selectDateRangeFromToday(
    daysFromToday: number,
    daysAfter: number
  ): Promise<{ dateFrom: string; dateTo: string }> {
    return await this.datePickerComponent.selectDatePickerRangeFromToday(
      daysFromToday,
      daysAfter
    );
  }

  async getDateToAssert(daysFromToday: number, daysAfter?: number): Promise<string | { startDate: string, endDate: string }> {
    return await this.datePickerComponent.getDateToAssert(daysFromToday, daysAfter);
  }
}

export { DatePickerPage };