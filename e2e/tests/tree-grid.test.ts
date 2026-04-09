import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.TreeGrid);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Tree Grid Tests', () => {
    test('Filter tree grid rows', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTable()).toBeVisible();
        await expect(pageObject.getRows()).toHaveCount(3);

        // Act
        await pageObject.search('report');

        // Assert
        await expect(pageObject.getRows()).toHaveCount(3);
        await expect(pageObject.getRowContaining('Reports')).toBeVisible();
        await expect(pageObject.getRowContaining('Report 1')).toBeVisible();
        await expect(pageObject.getRowContaining('Report 2')).toBeVisible();
    });
});