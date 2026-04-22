import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.Window);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Window Tests', () => {
    test('Complete window form and dismiss it', async ({ pageObject }) => {
        // Arrange
        const subject = 'Quarterly rollout';
        const text = 'Review the migration checklist before release.';

        await expect.poll(() => pageObject.getOpenWindowCount()).toBe(0);

        // Act
        await pageObject.openWindowForm();
        await pageObject.fillWindowForm(subject, text);
        const draft = await pageObject.getWindowFormDraft();
        await pageObject.closeActiveWindow();
        const canOpenWindowForm = await pageObject.canOpenWindowForm();

        // Assert
        expect(draft).toEqual({ subject, text });
        await expect.poll(() => pageObject.getOpenWindowCount()).toBe(0);
        expect(canOpenWindowForm).toBe(true);
    });

    test('Keep no-backdrop window open until explicitly closed', async ({ pageObject }) => {
        // Arrange
        await expect.poll(() => pageObject.getOpenWindowCount()).toBe(0);

        // Act
        await pageObject.openWindowWithoutBackdrop();
        const openedWindow = await pageObject.getActiveWindowCopy();
        await pageObject.pressEscape();
        const openWindowCountAfterEscape = await pageObject.getOpenWindowCount();
        const stillOpenWindow = await pageObject.getActiveWindowCopy();
        await pageObject.closeActiveWindow();

        // Assert
        expect(openedWindow.title).toContain('Window without backdrop');
        expect(openedWindow.content).toContain('Disabled close on escape click.');
        expect(openWindowCountAfterEscape).toBe(1);
        expect(stillOpenWindow.title).toContain('Window without backdrop');
        expect(stillOpenWindow.content).toContain('Disabled close on escape click.');
        await expect.poll(() => pageObject.getOpenWindowCount()).toBe(0);
    });
});