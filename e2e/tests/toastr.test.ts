import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.Toastr);
test.use({
  ignoreConsoleErrors: [
    'Specific error message to ignore',
    'Another error to ignore',
  ],
  authenticated: false,
});

test.describe('Toastr Tests', () => {
  test.afterEach(({ consoleErrorsTracker }) => {
    const consoleErrors = consoleErrorsTracker.getErrors();
    expect(consoleErrors.length).toBe(0);
  });

  test('Show basic toast with default settings', async ({
    pageObject,
    assertions,
  }) => {
    // Arrange Act
    await pageObject.clickShowToastButton();

    // Assert
    const toastrAssertions = assertions.createToastrAssertions();
    await toastrAssertions.expectToastToBeVisible();
  });
});
