import { createTestForStartPage, expect, StartPage } from '@fixtures/custom-test';

const test = createTestForStartPage(StartPage.FormLayouts);

test.use({
  ignoreConsoleErrors: [
    'Specific error message to ignore',
    'Another error to ignore',
  ],
  authenticated: false,
});

test.describe('Form Layouts Tests', () => {
  test('Submit Inline Form', async ({ pageObject }) => {
    // Act
    await pageObject.submitInlineFormWithOptions(
      'Jane Doe',
      'jane.doe@example.com',
      true
    );

    // Assert
    await expect(pageObject.getInlineForm()).toHaveClass(/ng-submitted/);
  });

  test('Submit grid form', async ({ pageObject }) => {
    // Act
    await pageObject.submitGridFormWithCredentials(
      'jane.doe@me.com',
      'st0ngp@$$w0rD',
      'Option 2'
    );

    // Assert
    await expect(pageObject.getGridForm()).toHaveClass(/ng-submitted/);
  });
});
