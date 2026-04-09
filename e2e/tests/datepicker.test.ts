import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.DatePicker);

test.use({
  trackNetworkErrors: true,
  ignoreConsoleErrors: [
    'Specific error message to ignore',
    'Another error to ignore',
  ],
  statusCodesToIgnore: [404],
  authenticated: false,
});

test.describe('Datepicker Tests', () => {
  test('Select date from common datepicker', async ({ pageObject, assertions }) => {
    // Arrange
    const datePickerAssertions = assertions.createDatePickerAssertions();
    const daysFromToday = 3;

    // Act
    await pageObject.selectCommonDateFromToday(daysFromToday);
    const dateToAssert = (await pageObject.getDateToAssert(
      daysFromToday
    )) as string;

    // Assert
    await datePickerAssertions.assertSelectedDate(
      '[data-testid="form-picker-input"]',
      dateToAssert
    );
  });

  test('Select date from date range picker', async ({ pageObject, assertions }) => {
    // Arrange
    const datePickerAssertions = assertions.createDatePickerAssertions();
    const daysFromToday = 14;
    const daysAfter = 15;

    // Act
    await pageObject.selectDateRangeFromToday(daysFromToday, daysAfter);
    const dateRange = (await pageObject.getDateToAssert(
      daysFromToday,
      daysAfter
    )) as { startDate: string; endDate: string };

    // Assert
    await datePickerAssertions.assertDateRange(
      '[data-testid="range-picker-input"]',
      dateRange.startDate,
      dateRange.endDate
    );
  });
});
