import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';
import { ConsoleErrorsTracker } from "@utils/console-errors-tracker";

const test = createTestForStartPage(StartPage.DatePicker);

test.use({
    ignoreConsoleErrors: [
        'Specific error message to ignore',
        'Another error to ignore',
    ],
    authenticated: false,
});

test.describe('Datepicker Tests', () => {
    test('Select date from common datepicker', async ({
        pageObject,
        consoleErrorsTracker,
        assertions,
    }) => {
        // Arrange
        const datePickerAssertions = assertions.createDatePickerAssertions();
        const daysFromToday = 3;

        // Act
        await pageObject.selectCommonDateFromToday(daysFromToday);
        const dateToAssert = await pageObject.getDateToAssert(daysFromToday) as string;

        // Assert
        await datePickerAssertions.assertSelectedDate('input[placeholder="Form Picker"]', dateToAssert);

        // Check for console errors
        const consoleErrors = consoleErrorsTracker.getErrors();
        expect(consoleErrors.length).toBe(0);
    });

    test('Select date from date range picker', async ({
        pageObject,
        consoleErrorsTracker,
        assertions,
    }) => {
        // Arrange
        const datePickerAssertions = assertions.createDatePickerAssertions();
        const daysFromToday = 14;
        const daysAfter = 15;

        // Act
        await pageObject.selectDateRangeFromToday(daysFromToday, daysAfter);
        const dateRange = await pageObject.getDateToAssert(daysFromToday, daysAfter) as { startDate: string; endDate: string };

        // Assert
        await datePickerAssertions.assertDateRange('input[placeholder="Range Picker"]',
            dateRange.startDate,
            dateRange.endDate
        );

        // Check for console errors
        const consoleErrors = consoleErrorsTracker.getErrors();
        expect(consoleErrors.length).toBe(0);
    });
});