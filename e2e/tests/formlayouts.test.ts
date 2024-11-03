import { test, StartPage } from '@fixtures/base-fixtures';

test.describe('Form Layouts', () => {
  test.use({
    startPage: StartPage.FormLayouts || 'defaultPage',
    trackConsoleErrors: true,
    ignoreConsoleErrors: ['Error msg to ignore during test suit execution'],
  });

  test('Should submit inline form successfully', async ({
    formLayoutsPage,
  }) => {
    await formLayoutsPage.submitInlineFormWithOptions(
      'Jane Doe',
      'jane.doe@example.com',
      true
    );
  });
});
