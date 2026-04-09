import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.Calendar);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Calendar Tests', () => {
    test('Render calendar cards with initial selections', async ({ pageObject }) => {
        await expect(pageObject.getCard('inline')).toBeVisible();
        await expect(pageObject.getCard('range')).toBeVisible();
        await expect(pageObject.getCard('custom')).toBeVisible();
        await expect(pageObject.getPreviewValue('inline')).not.toBeEmpty();
        await expect(pageObject.getRangeValue('start')).not.toBeEmpty();
        await expect(pageObject.getRangeValue('end')).not.toBeEmpty();
        await expect(pageObject.getPreviewValue('custom')).not.toBeEmpty();
        await expect(pageObject.getRangeBoundaryButton('end')).toHaveAttribute('aria-pressed', 'true');
    });

    test('Update inline and custom calendar selections', async ({ pageObject }) => {
        // Arrange
        const initialInline = await pageObject.getPreviewValue('inline').textContent();
        const initialCustom = await pageObject.getPreviewValue('custom').textContent();

        // Act
        await pageObject.selectDifferentDay('inline');
        await pageObject.selectDifferentDay('custom');

        // Assert
        await expect(pageObject.getPreviewValue('inline')).not.toHaveText(initialInline ?? '');
        await expect(pageObject.getPreviewValue('custom')).not.toHaveText(initialCustom ?? '');
        await expect(pageObject.getCustomCaption()).not.toBeEmpty();
    });

    test('Switch range boundary and reset the selected range', async ({ pageObject }) => {
        // Arrange
        const initialStart = await pageObject.getRangeValue('start').textContent();
        const initialEnd = await pageObject.getRangeValue('end').textContent();

        // Act
        await pageObject.getRangeBoundaryButton('start').click();
        await expect(pageObject.getRangeBoundaryButton('start')).toHaveAttribute('aria-pressed', 'true');
        await expect(pageObject.getRangeHint()).toContainText('start');

        await pageObject.selectDifferentDay('range');
        await expect(pageObject.getRangeValue('start')).not.toHaveText(initialStart ?? '');
        await expect(pageObject.getRangeBoundaryButton('end')).toHaveAttribute('aria-pressed', 'true');
        await expect(pageObject.getRangeHint()).toContainText('end');

        const lastIndex = Math.max((await pageObject.getSelectableDayButtons('range').count()) - 1, 0);
        await pageObject.selectDifferentDay('range', lastIndex);
        await expect(pageObject.getRangeValue('end')).not.toHaveText(initialEnd ?? '');
        await expect(pageObject.getRangeBoundaryButton('start')).toHaveAttribute('aria-pressed', 'true');

        await pageObject.getResetButton().click();

        // Assert
        await expect(pageObject.getRangeValue('start')).toHaveText(initialStart ?? '');
        await expect(pageObject.getRangeValue('end')).toHaveText(initialEnd ?? '');
        await expect(pageObject.getRangeBoundaryButton('end')).toHaveAttribute('aria-pressed', 'true');
    });
});