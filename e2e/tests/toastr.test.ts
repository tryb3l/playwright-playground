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
  test('Show basic toast with default settings', async ({
    pageObject,
    assertions,
  }) => {
    // Arrange
    const toastrAssertions = assertions.createToastrAssertions();

    // Act
    await pageObject.clickShowToastButton();

    // Assert
    await toastrAssertions.expectToastToBeVisible();
  });
});
