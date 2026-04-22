import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.Dialog);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Dialog Tests', () => {
    test('Return result from dialog', async ({ pageObject }) => {
        // Arrange
        const name = 'Ada Lovelace';

        // Act
        await pageObject.submitNamePrompt(name);

        // Assert
        await expect(pageObject.getSubmittedName(name)).toBeVisible();
    });
});