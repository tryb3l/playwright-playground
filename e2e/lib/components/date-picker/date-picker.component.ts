import { BaseComponent } from '@components/base.component';
import { expect } from '@playwright/test';

class DatePickerComponent extends BaseComponent {
  private async selectDateInCalendar(daysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    const expectedDay = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('default', {
      month: 'short',
    });
    const expectedMonthLong = date.toLocaleString('default', { month: 'long' });
    const expectedYear = date.getFullYear().toString();
    const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`;

    let calendarMonthYear = await this.page
      .locator('nb-calendar-view-mode')
      .textContent();
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;
    while (
      calendarMonthYear &&
      !calendarMonthYear.includes(expectedMonthAndYear)
    ) {
      await this.page
        .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
        .click();
      calendarMonthYear = await this.page
        .locator('nb-calendar-view-mode')
        .textContent();
    }
    await this.page
      .locator('.day-cell.ng-star-inserted')
      .getByText(expectedDay, { exact: true })
      .click();

    return dateToAssert;
  }

  async selectCommonDatepickerDateFromToday(daysFromToday: number) {
    const calendarInputField = await this.page.locator(
      'input[placeholder="Form Picker"]'
    );
    await calendarInputField.click();
    const dateToAssert = await this.selectDateInCalendar(daysFromToday);

    await expect(calendarInputField).toHaveValue(dateToAssert);
  }

  async selectDatePickerRangeFromToday(
    daysFromToday: number,
    daysAfter: number
  ) {
    const calendarInputField = await this.page.getByPlaceholder('Range Picker');
    await calendarInputField.click();
    const dateFrom = await this.selectDateInCalendar(daysFromToday);
    const dateTo = await this.selectDateInCalendar(daysAfter);

    await expect(calendarInputField).toHaveValue(`${dateFrom} - ${dateTo}`);
  }
}

export { DatePickerComponent };
