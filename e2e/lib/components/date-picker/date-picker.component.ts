import { BaseComponent } from '@components/base.component';

class DatePickerComponent extends BaseComponent {
  private async selectDateInCalendar(daysFromToday: number) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    const expectedDay = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('default', {
      month: 'short',
    });
    const expectedMonthLong = date.toLocaleString('default', { month: 'long' });
    const expectedYear = date.getFullYear().toString();
    const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`;
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;
    let calendarMonthYear = await this.getText('nb-calendar-view-mode');

    while (
      calendarMonthYear &&
      !calendarMonthYear.includes(expectedMonthAndYear)
    ) {
      await this.click(
        'nb-calendar-pageable-navigation [data-name="chevron-right"]'
      );
      calendarMonthYear = await this.getText('nb-calendar-view-mode');
    }
    await this.click('.day-cell.ng-star-inserted', {
      text: expectedDay,
      exact: true,
    });

    return dateToAssert;
  }

  async selectCommonDatepickerDateFromToday(daysFromToday: number) {
    const calendarInputField = this.getByPlaceholder('Form Picker');
    await calendarInputField.click();
    await this.selectDateInCalendar(daysFromToday);
  }

  async selectDatePickerRangeFromToday(
    daysFromToday: number,
    daysAfter: number
  ) {
    const calendarInputField = this.getByPlaceholder('Range Picker');
    await calendarInputField.click();
    const dateFrom = await this.selectDateInCalendar(daysFromToday);
    const dateTo = await this.selectDateInCalendar(daysAfter);
    return {dateFrom, dateTo}
  }

  async getDateToAssert(daysFromToday: number, daysAfter?: number): Promise<string | { startDate: string, endDate: string }> {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    const expectedDay = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('default', {
      month: 'short',
    });
    const expectedYear = date.getFullYear().toString();
    const startDate = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`;

    if (daysAfter !== undefined) {
      const endDateObj = new Date();
      endDateObj.setDate(endDateObj.getDate() + daysAfter);
      const endDay = endDateObj.getDate().toString();
      const endMonthShort = endDateObj.toLocaleString('default', {
        month: 'short',
      });
      const endYear = endDateObj.getFullYear().toString();
      const endDate = `${endMonthShort} ${endDay}, ${endYear}`;
      return { startDate, endDate };
    }

    return startDate;
  }
}
export { DatePickerComponent };