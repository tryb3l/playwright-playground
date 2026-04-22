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
        await expect.poll(() => pageObject.getVisibleRowCount()).toBe(3);

        // Act
        await pageObject.filterBy('report');

        // Assert
        await expect.poll(() => pageObject.getVisibleNames()).toEqual([
            'Reports',
            'Report 1',
            'Report 2',
        ]);
    });

    test('Sort and expand tree grid rows through page semantics', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTable()).toBeVisible();

        // Act
        await pageObject.sortBy('Size', 'desc');
        const sortedNames = await pageObject.getVisibleNames();
        await pageObject.toggleDirectory('Reports');
        const expandedNames = await pageObject.getVisibleNames();

        // Assert
        expect(sortedNames).toEqual([
            'Other',
            'Projects',
            'Reports',
        ]);
        expect(expandedNames).toEqual([
            'Other',
            'Projects',
            'Reports',
            'Report 2',
            'Report 1',
        ]);
    });
});