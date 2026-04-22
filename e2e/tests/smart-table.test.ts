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
        await expect.poll(() => pageObject.getVisibleRowCount()).toBe(10);

        // Act
        await pageObject.filterByFirstName('Mark');

        // Assert
        await expect.poll(() => pageObject.getVisibleRowCount()).toBe(2);
        await expect.poll(() => pageObject.getVisibleEmails()).toEqual([
            'mdo@gmail.com',
            'mark@gmail.com',
        ]);
    });

    test('Sort table by age and paginate results', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTable()).toBeVisible();
        const initialFirstRow = await pageObject.getVisibleRow(0);

        // Act
        await pageObject.sortByAge('desc');
        const firstSortedRow = await pageObject.getVisibleRow(0);
        await pageObject.goToPage(2);

        // Assert
        expect(firstSortedRow).toMatchObject({
            firstName: 'Jeanne',
            age: '59',
        });
        expect(initialFirstRow).not.toEqual(firstSortedRow);
        await expect.poll(() => pageObject.isPageActive(2)).toBe(true);
        await expect.poll(() => pageObject.getVisibleRow(0)).not.toMatchObject(firstSortedRow);
    });
});