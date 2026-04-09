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

        await expect(pageObject.getDialogs()).toHaveCount(0);

        // Act
        await pageObject.openWindowForm();
        await expect(pageObject.getSubjectInput()).toBeVisible();

        await pageObject.fillWindowForm(subject, text);
        await expect(pageObject.getSubjectInput()).toHaveValue(subject);
        await expect(pageObject.getTextInput()).toHaveValue(text);

        await pageObject.closeWindowForm();

        // Assert
        await expect(pageObject.getDialogs()).toHaveCount(0);
        await expect(pageObject.getOpenFormButton()).toBeVisible();
    });

    test('Keep no-backdrop window open until explicitly closed', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getDialogs()).toHaveCount(0);

        // Act
        await pageObject.openWindowWithoutBackdrop();
        await expect(pageObject.getDialogTitle()).toContainText('Window without backdrop');
        await expect(pageObject.getDialogContent()).toContainText('Disabled close on escape click.');

        await pageObject.pressEscape();

        // Assert
        await expect(pageObject.getDialogs()).toHaveCount(1);
        await expect(pageObject.getDialogTitle()).toContainText('Window without backdrop');
        await expect(pageObject.getDialogContent()).toContainText('Disabled close on escape click.');

        await pageObject.closeNoBackdropWindow();
        await expect(pageObject.getDialogs()).toHaveCount(0);
    });
});