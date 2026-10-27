import { createTestForStartPage, expect, StartPage } from '@fixtures/custom-test';

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
  test('Select date from common datepicker', async ({ pageObject }) => {
    // Arrange
    const daysFromToday = 3;

    // Act
    const expectedDate =
      await pageObject.selectCommonDateFromToday(daysFromToday);

    // Assert
    await expect(pageObject.getCommonDateInput()).toHaveValue(expectedDate);
  });

  test('Select date from date range picker', async ({ pageObject }) => {
    // Arrange
    const daysFromToday = 14;
    const daysAfter = 15;

    // Act
    const { dateFrom, dateTo } = await pageObject.selectDateRangeFromToday(
      daysFromToday,
      daysAfter
    );

    // Assert
    await expect(pageObject.getDateRangeInput()).toHaveValue(
      `${dateFrom} - ${dateTo}`
    );
  });
});
