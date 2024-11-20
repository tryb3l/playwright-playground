import { BaseAssertions } from './base-assertions';

export class DatePickerAssertions extends BaseAssertions {
  async assertCalendarVisible() {
    await this.expectToBeVisible('nb-calendar');
  }

  async assertSelectedDate(pickerSelector: string, expectedValue: string) {
    await this.expectToHaveValue(pickerSelector, expectedValue);
  }

  async assertDateRange(
    rangePickerSelector: string,
    startDate: string,
    endDate: string
  ) {
    await this.expectToHaveValue(
      rangePickerSelector,
      `${startDate} - ${endDate}`
    );
  }
}
