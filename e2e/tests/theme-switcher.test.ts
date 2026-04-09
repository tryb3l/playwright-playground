import { test as baseTest } from '@fixtures/base-fixtures';
import { HeaderComponent } from '@components/navbar/header.component';
import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

baseTest.use({ authenticated: false });
const calendarTest = createTestForStartPage(StartPage.Calendar);

calendarTest.use({ authenticated: false, trackNetworkErrors: true });

baseTest.describe('Theme Switcher Tests', () => {
    baseTest('Persist selected theme after reload', async ({ page, pageManager }) => {
        // Arrange
        await pageManager.navigateTo(StartPage.Calendar);
        const header = new HeaderComponent(page);

        // Act
        await header.selectTheme('corporate');

        // Assert
        await expect(page.locator('html')).toHaveAttribute('data-app-theme', 'corporate');
        await expect
            .poll(async () => page.evaluate(() => localStorage.getItem('ngx-admin.app-theme')))
            .toBe('corporate');

        await page.reload();

        await expect(page.locator('html')).toHaveAttribute('data-app-theme', 'corporate');
        await expect(header.getSelectedThemeValue()).toHaveText('Corporate');
    });
});

calendarTest.describe('Theme Switcher Calendar Tests', () => {
    calendarTest('Keep theme switcher and calendar days readable in dark themes', async ({ page, pageObject }) => {
        // Arrange
        const header = new HeaderComponent(page);

        // Act
        await header.selectTheme('dark');

        // Assert
        await expect(page.locator('html')).toHaveAttribute('data-app-theme', 'dark');
        await expect(header.getSelectedThemeValue()).toHaveText('Dark');
        await expect(header.getSelectedThemeValue()).toHaveCSS('color', 'rgb(237, 243, 255)');
        await expect(pageObject.getDayCellContent('inline')).toHaveCSS('color', 'rgb(237, 243, 255)');

        await header.selectTheme('cosmic');

        await expect(page.locator('html')).toHaveAttribute('data-app-theme', 'cosmic');
        await expect(header.getSelectedThemeValue()).toHaveText('Cosmic');
        await expect(header.getSelectedThemeValue()).toHaveCSS('color', 'rgb(243, 232, 255)');
        await expect(pageObject.getDayCellContent('inline')).toHaveCSS('color', 'rgb(243, 232, 255)');
    });
});