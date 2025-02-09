import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';
import { ConsoleErrorsTracker } from "@utils/console-errors-tracker";


const test = createTestForStartPage(StartPage.Toastr);
test.use({
    ignoreConsoleErrors: [
        'Specific error message to ignore',
        'Another error to ignore',
    ],
    authenticated: false,
})

test.describe('Toastr Tests', () => {
    test('Show basic toast with default settings', async ({ pageObject, consoleErrorsTracker, assertions }) => {
        // Arrange Act
        await pageObject.clickShowToastButton();

        // Assert
        const toastrAssertions = assertions.createToastrAssertions();
        await toastrAssertions.expectToastToBeVisible();

        // Check for console errors
        const consoleErrors = consoleErrorsTracker.getErrors();
        expect(consoleErrors.length).toBe(0);
    })
});