import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.SmartTable);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Smart Table Tests', () => {
    test('Filter smart table rows by first name', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTable()).toBeVisible();
        await expect(pageObject.getRows()).toHaveCount(10);

        // Act
        await pageObject.filterBy('First Name', 'Mark');

        // Assert
        await expect(pageObject.getRows()).toHaveCount(2);
        await expect(pageObject.getRowContaining('mdo@gmail.com')).toHaveCount(1);
        await expect(pageObject.getRowContaining('mark@gmail.com')).toHaveCount(1);
    });

    test('Sort table by age and paginate results', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTable()).toBeVisible();
        const initialFirstRow = await pageObject.getRows().first().textContent();

        // Act
        await pageObject.sortBy('Age', 'desc');

        await expect(pageObject.getRows().first()).not.toHaveText(initialFirstRow ?? '');
        await expect(pageObject.getRows().first()).toContainText('Jeanne');
        await expect(pageObject.getRows().first()).toContainText('59');

        const firstSortedRow = await pageObject.getRows().first().textContent();
        await pageObject.goToPage(2);

        // Assert
        await expect(pageObject.getActivePage()).toContainText('2');
        await expect(pageObject.getRows().first()).not.toHaveText(firstSortedRow ?? '');
        await expect(pageObject.getPaginationNav()).toBeVisible();
    });
});