import { createTestForStartPage, expect, StartPage } from '@fixtures/custom-test';

const test = createTestForStartPage(StartPage.Toastr);
test.use({
  ignoreConsoleErrors: [
    'Specific error message to ignore',
    'Another error to ignore',
  ],
  authenticated: false,
});

test.describe('Toastr Tests', () => {
  test('Show basic toast with default settings', async ({ pageObject }) => {
    // Act
    await pageObject.showToast();

    // Assert
    await expect(pageObject.getToast()).toBeVisible();
  });
});
