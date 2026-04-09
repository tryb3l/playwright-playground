import { Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

class DatePickerComponent extends BaseComponent {
  private readonly calendarSelector = 'mat-calendar';
  private readonly calendarViewModeSelector =
    'button.mat-calendar-period-button';
  private readonly navChevronSelector = 'button.mat-calendar-next-button';
  private readonly dayCellSelector = 'button.mat-calendar-body-cell';

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
    daysFromToday: number
  ): Promise<string> {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);

    const expectedDay = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('default', {
      month: 'short',
    });
    const expectedYear = date.getFullYear().toString();
    const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`;

    // Navigate to the correct month/year using the next button if needed
    let calendarMonthYear = await this.getText(this.calendarViewModeSelector);
    while (
      calendarMonthYear &&
      !this.isExpectedCalendarMonth(calendarMonthYear, expectedMonthShort, expectedYear)
    ) {
      await this.click(this.navChevronSelector);
      calendarMonthYear = await this.getText(this.calendarViewModeSelector);
    }

    await this.click(this.dayCellSelector, {
      text: expectedDay,
      exact: true,
      useFirst: true,
    });

    return dateToAssert;
  }

  private async openPickerInput(testId: string): Promise<void> {
    const pickerInput = this.getByTestId(testId);
    await pickerInput.evaluate((element) => {
      element.scrollIntoView({ block: 'center', inline: 'nearest' });
    });
    await pickerInput.click({ force: true });
  }

  private isExpectedCalendarMonth(
    calendarMonthYear: string,
    expectedMonthShort: string,
    expectedYear: string
  ): boolean {
    const normalizedMonthYear = calendarMonthYear.replace(/\s+/g, ' ').trim().toLowerCase();
    const expectedMonthToken = expectedMonthShort.toLowerCase();

    return normalizedMonthYear.includes(expectedMonthToken)
      && normalizedMonthYear.includes(expectedYear);
  }

  /**
   * Selects a date in the common datepicker that is a specified number of days from today
   * @param daysFromToday Number of days from today to select
   */
  async selectCommonDatepickerDateFromToday(
    daysFromToday: number
  ): Promise<void> {
    await this.openPickerInput('form-picker-input');
    await this.selectDateInCalendar(daysFromToday);
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
    await this.openPickerInput('range-picker-input');

    const dateFrom = await this.selectDateInCalendar(daysFromToday);

    const dateTo = await this.selectDateInCalendar(daysAfter);

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
