import { test as baseTest } from '@fixtures/base-fixtures';
import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';
import { CalendarPage } from '@pages/calendar.page';

baseTest.use({ authenticated: false });
const calendarTest = createTestForStartPage(StartPage.Calendar);

calendarTest.use({ authenticated: false, trackNetworkErrors: true });

baseTest.describe('Theme Switcher Tests', () => {
    baseTest('Persist selected theme after reload', async ({ pageManager }) => {
        // Arrange
        const calendarPage = pageManager.getPage(CalendarPage);
        await pageManager.navigateTo(StartPage.Calendar);

        // Act
        await calendarPage.selectTheme('corporate');
        const storedTheme = await calendarPage.getStoredTheme();
        await calendarPage.reload();

        // Assert
        await expect(calendarPage.getThemeHost()).toHaveAttribute('data-app-theme', 'corporate');
        expect(storedTheme).toBe('corporate');
        await expect(calendarPage.getSelectedThemeValue()).toHaveText('Corporate');
    });
});

calendarTest.describe('Theme Switcher Calendar Tests', () => {
    calendarTest('Keep theme switcher and calendar days readable in dark themes', async ({ pageObject }) => {
        // Arrange
        const readThemeState = async () => ({
            theme: await pageObject.getThemeHost().getAttribute('data-app-theme'),
            label: ((await pageObject.getSelectedThemeValue().textContent()) ?? '').trim(),
            labelColor: await pageObject.getSelectedThemeValue().evaluate((element) => getComputedStyle(element).color),
            dayColor: await pageObject.getDayCellContent('inline').evaluate((element) => getComputedStyle(element).color),
        });

        // Act
        await pageObject.selectTheme('dark');
        const darkThemeState = await readThemeState();
        await pageObject.selectTheme('cosmic');
        const cosmicThemeState = await readThemeState();

        // Assert
        expect(darkThemeState).toEqual({
            theme: 'dark',
            label: 'Dark',
            labelColor: 'rgb(237, 243, 255)',
            dayColor: 'rgb(237, 243, 255)',
        });
        expect(cosmicThemeState).toEqual({
            theme: 'cosmic',
            label: 'Cosmic',
            labelColor: 'rgb(243, 232, 255)',
            dayColor: 'rgb(243, 232, 255)',
        });
    });
});