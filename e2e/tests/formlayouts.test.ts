import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.FormLayouts);

test.use({
  ignoreConsoleErrors: [
    'Specific error message to ignore',
    'Another error to ignore',
  ],
  authenticated: false,
});

test.describe('Form Layouts Tests', () => {
  test('Submit Inline Form', async ({
    pageObject,
    consoleErrorsTracker,
    assertions,
  }) => {
    // Arrange
    const formAssertions = assertions.createFormAssertions();

    // Act
    await pageObject.submitInlineFormWithOptions(
      'Jane Doe',
      'jane.doe@example.com',
      true
    );

    // Assert
    await formAssertions.assertFormSubmitted('form.form-inline');

    // Check for console errors
    const consoleErrors = consoleErrorsTracker.getErrors();
    expect(consoleErrors.length).toBe(0);
  });
});
