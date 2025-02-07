import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

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
        const dateToAssert = await pageObject.getDateToAssert(daysFromToday);

        // Assert
        await datePickerAssertions.assertSelectedDate('input[placeholder="Form Picker"]', dateToAssert);

        // Check for console errors
        const consoleErrors = consoleErrorsTracker.getErrors();
        expect(consoleErrors.length).toBe(0);
    });
});