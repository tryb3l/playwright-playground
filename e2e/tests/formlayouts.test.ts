import { test, StartPage } from '@fixtures/base-fixtures';

test.describe('Form Layouts', () => {
  test.use({ startPage: StartPage.FormLayouts });

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
