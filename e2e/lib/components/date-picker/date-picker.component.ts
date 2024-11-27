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
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const dateToAssert = await this.selectDateInCalendar(daysFromToday);

    // await expect(calendarInputField).toHaveValue(dateToAssert);
  }

  async selectDatePickerRangeFromToday(
    daysFromToday: number,
    daysAfter: number
  ) {
    const calendarInputField = this.getByPlaceholder('Range Picker');
    await calendarInputField.click();
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const dateFrom = await this.selectDateInCalendar(daysFromToday);
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const dateTo = await this.selectDateInCalendar(daysAfter);

    // await expect(calendarInputField).toHaveValue(`${dateFrom} - ${dateTo}`);
  }
}

export { DatePickerComponent };
