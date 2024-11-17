import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.FormLayouts);

// Example of how to use ignoreConsoleErrors to ignore specific console errors
test.use({
  ignoreConsoleErrors: [
    'Specific error message to ignore',
    'Another error to ignore',
  ],
  authenticated: false,
});

test.describe('Form Layouts Tests', () => {
  test('Submit Inline Form', async ({ pageObject, consoleErrorsTracker }) => {
    await pageObject.submitInlineFormWithOptions(
      'Jane Doe',
      'jane.doe@example.com',
      true
    );

    //Assertions
    //const successMessage = await pageObject.getSuccessMessage();
    //expect(successMessage).toContain('Form submitted successfully');
    // Check for console errors
    const consoleErrors = consoleErrorsTracker.getErrors();
    expect(consoleErrors.length).toBe(0);
  });
});
