import { Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

class DatePickerComponent extends BaseComponent {
  private readonly calendarSelector = 'nb-calendar';
  private readonly calendarViewModeSelector = 'nb-calendar-view-mode';
  private readonly navChevronSelector = 'nb-calendar-pageable-navigation [data-name="chevron-right"]';
  private readonly dayCellSelector = '.day-cell.ng-star-inserted';

  constructor(page: Page) {
    super(page, 'DatePickerComponent');
  }

  private async selectDateInCalendar(daysFromToday: number): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);

    const expectedDay = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('default', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('default', { month: 'long' });
    const expectedYear = date.getFullYear().toString();
    const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`;
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

    let calendarMonthYear = await this.getText(this.calendarViewModeSelector);
    while (calendarMonthYear && !calendarMonthYear.includes(expectedMonthAndYear)) {
      await this.click(this.navChevronSelector);
      calendarMonthYear = await this.getText(this.calendarViewModeSelector);
    }

    await this.click(this.dayCellSelector, { text: expectedDay, exact: true });
    return dateToAssert;
  }

  async selectCommonDatepickerDateFromToday(daysFromToday: number): Promise<void> {
    const calendarInputField = this.getByPlaceholder('Form Picker');
    await calendarInputField.click();
    await this.selectDateInCalendar(daysFromToday);
  }

  async selectDatePickerRangeFromToday(
    daysFromToday: number,
    daysAfter: number
  ): Promise<{ dateFrom: string; dateTo: string }> {
    const calendarInputField = this.getByPlaceholder('Range Picker');
    await calendarInputField.click();

    const dateFrom = await this.selectDateInCalendar(daysFromToday);
    const dateTo = await this.selectDateInCalendar(daysAfter);
    return { dateFrom, dateTo };
  }

  async getDateToAssert(
    daysFromToday: number,
    daysAfter?: number
  ): Promise<string | { startDate: string; endDate: string }> {
    const start = new Date();
    start.setDate(start.getDate() + daysFromToday);
    const startDate = `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()}, ${start.getFullYear()}`;

    if (daysAfter !== undefined) {
      const end = new Date();
      end.setDate(end.getDate() + daysAfter);
      const endDate = `${end.toLocaleString('default', { month: 'short' })} ${end.getDate()}, ${end.getFullYear()}`;
      return { startDate, endDate };
    }

    return startDate;
  }
}

export { DatePickerComponent };