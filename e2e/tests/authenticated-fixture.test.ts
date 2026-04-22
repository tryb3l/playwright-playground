import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.IoTDashboard);

test.use({ authenticated: true });

test.describe('Authenticated Fixture Tests', () => {
    test('bootstrap auth state before opening the dashboard', async ({ page, pageObject }) => {
        // Arrange
        await expect(pageObject.getLivingLayout()).toBeVisible();

        // Act
        const storageState = await page.context().storageState();
        const authStorageKeys = storageState.origins
            .flatMap((origin) => origin.localStorage)
            .map(({ name }) => name)
            .filter((name) => /auth|token/i.test(name));

        // Assert
        expect(authStorageKeys).not.toHaveLength(0);
    });
});