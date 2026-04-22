import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.Calendar);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Calendar Tests', () => {
    test('Render calendar cards with initial selections', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getCard('inline')).toBeVisible();
        await expect(pageObject.getCard('range')).toBeVisible();
        await expect(pageObject.getCard('custom')).toBeVisible();

        // Act
        const summary = await pageObject.getSelectionSummary();

        // Assert
        expect(summary.inline).not.toBe('');
        expect(summary.rangeStart).not.toBe('');
        expect(summary.rangeEnd).not.toBe('');
        expect(summary.custom).not.toBe('');
        expect(summary.activeRangeBoundary).toBe('end');
    });

    test('Update inline and custom calendar selections', async ({ pageObject }) => {
        // Arrange
        const initialSummary = await pageObject.getSelectionSummary();

        // Act
        await pageObject.selectDifferentDay('inline');
        await pageObject.selectDifferentDay('custom');

        // Assert
        await expect.poll(async () => (await pageObject.getSelectionSummary()).inline).not.toBe(initialSummary.inline);
        await expect.poll(async () => (await pageObject.getSelectionSummary()).custom).not.toBe(initialSummary.custom);
        await expect.poll(async () => (await pageObject.getSelectionSummary()).customCaption).not.toBe('');
    });

    test('Switch range boundary and reset the selected range', async ({ pageObject }) => {
        // Arrange
        const initialRange = await pageObject.getRangeState();

        // Act
        await pageObject.updateRangeBoundaryWithDifferentDay('start');
        const rangeAfterStartUpdate = await pageObject.getRangeState();
        await pageObject.updateRangeBoundaryWithDifferentDay('end', 'last');
        const rangeAfterEndUpdate = await pageObject.getRangeState();
        await pageObject.resetRangeSelection();
        const resetRange = await pageObject.getRangeState();

        // Assert
        expect(rangeAfterStartUpdate.start).not.toBe(initialRange.start);
        expect(rangeAfterStartUpdate.activeBoundary).toBe('end');
        expect(rangeAfterStartUpdate.hint).toContain('end');
        expect(rangeAfterEndUpdate.end).not.toBe(initialRange.end);
        expect(rangeAfterEndUpdate.activeBoundary).toBe('start');
        expect(resetRange).toEqual(initialRange);
    });
});