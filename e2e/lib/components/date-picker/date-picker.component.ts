import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

class DatePickerComponent extends BaseComponent {
  private readonly calendarSelector = 'nb-calendar';
  private readonly calendarViewModeSelector = 'nb-calendar-view-mode';
  private readonly navChevronSelector = 'nb-calendar-pageable-navigation [data-name="chevron-right"]';
  private readonly commonDayCellSelector = 'nb-calendar-day-cell.day-cell.ng-star-inserted:not(.bounding-month)';
  private readonly rangeDayCellSelector = 'nb-calendar-range-day-cell.day-cell.ng-star-inserted';
  private readonly currentMonthRangeDayCellSelector = 'nb-calendar-range-day-cell.day-cell.ng-star-inserted:not(.bounding-month)';

  constructor(page: Page) {
    super(page, 'DatePickerComponent');
  }

  /**
   * Selects a date in the calendar by navigating to the correct month and clicking the day
   * @param daysFromToday Number of days from today to select
   * @param isRangePicker Whether this is being used in a range picker context
   * @returns The formatted date string for assertion
   */
  private async selectDateInCalendar(
    daysFromToday: number,
    isRangePicker: boolean = false
  ): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);

    const expectedDay = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('default', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('default', { month: 'long' });
    const expectedYear = date.getFullYear().toString();
    const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`;
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

    // Navigate to the correct month/year using the next button if needed
    let calendarMonthYear = await this.getText(this.calendarViewModeSelector);
    while (calendarMonthYear && !calendarMonthYear.includes(expectedMonthAndYear)) {
      await this.click(this.navChevronSelector);
      calendarMonthYear = await this.getText(this.calendarViewModeSelector);
    }

    if (isRangePicker) {

      const calendarContainer = await this.page.locator('nb-calendar-range').first();
      const cells = await calendarContainer
        .locator(this.currentMonthRangeDayCellSelector)
        .filter({ hasText: new RegExp(`^${expectedDay}$`) })
        .all();

      if (cells.length > 0) {
        await cells[0].click();
      } else {
        const anyCells = await calendarContainer
          .locator(this.rangeDayCellSelector)
          .filter({ hasText: new RegExp(`^${expectedDay}$`) })
          .all();

        if (anyCells.length > 0) {
          await anyCells[0].click();
        } else {
          throw new Error(`Could not find any date cell with text "${expectedDay}" in range picker`);
        }
      }
    } else {
      await this.click(this.commonDayCellSelector, {
        text: expectedDay,
        exact: true,
        useFirst: true
      });
    }

    return dateToAssert;
  }

  /**
   * Selects a date in the common datepicker that is a specified number of days from today
   * @param daysFromToday Number of days from today to select
   */
  async selectCommonDatepickerDateFromToday(daysFromToday: number): Promise<void> {
    const calendarInputField = this.getByPlaceholder('Form Picker');
    await calendarInputField.click();
    await this.selectDateInCalendar(daysFromToday, false);
  }

  /**
   * Selects a date range in the range picker
   * @param daysFromToday Number of days from today for the start date
   * @param daysAfter Number of days from today for the end date
   * @returns Object containing formatted start and end dates for assertion
   */
  async selectDatePickerRangeFromToday(
    daysFromToday: number,
    daysAfter: number
  ): Promise<{ dateFrom: string; dateTo: string }> {
    const calendarInputField = this.getByPlaceholder('Range Picker');
    await calendarInputField.click();

    const dateFrom = await this.selectDateInCalendar(daysFromToday, true);

    const dateTo = await this.selectDateInCalendar(daysAfter, true);

    return { dateFrom, dateTo };
  }

  /**
   * Generates formatted date strings for assertions
   * @param daysFromToday Number of days from today
   * @param daysAfter Optional number of days after for range assertions
   * @returns Formatted date string(s) for assertion
   */
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