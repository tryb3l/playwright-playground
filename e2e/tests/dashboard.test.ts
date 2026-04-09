import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.IoTDashboard);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Dashboard Smoke Tests', () => {
    test('Render dashboard shell widgets', async ({ pageObject }) => {
        await expect(pageObject.getLivingLayout()).toBeVisible();
        await expect(pageObject.getMainColumn()).toBeVisible();
        await expect(pageObject.getSidebarColumn()).toBeVisible();
        await expect(pageObject.getRoomSelectorCard()).toBeVisible();
        await expect(pageObject.getRoomsCard()).toBeVisible();
        await expect(pageObject.getSolarCard()).toBeVisible();
        await expect(pageObject.getWeatherCard()).toBeVisible();
        await expect(pageObject.getKittenCard()).toBeVisible();
        await expect(pageObject.getKittenDescription()).toContainText('UI Kitten');
    });
});

test.describe('Dashboard Behavior Tests', () => {
    test('Switch migrated room selector state', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getRoomSelectorCard()).toBeVisible();
        await expect(pageObject.getRoomSelectorRoom('2')).toHaveClass(/selected-room/);

        // Act
        await pageObject.getRoomSelectorRoomHitbox('0').click();

        // Assert
        await expect(pageObject.getRoomSelectorRoom('0')).toHaveClass(/selected-room/);
        await expect(pageObject.getRoomSelectorRoom('2')).not.toHaveClass(/selected-room/);
    });

    test('Switch migrated security cameras views', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getSecurityCamerasCard()).toBeVisible();
        await expect(pageObject.getSecurityCamerasGridView()).toBeVisible();
        await expect(pageObject.getSecurityCameraTiles()).toHaveCount(4);
        await expect(pageObject.getSecurityCamerasGridViewButton()).toHaveAttribute('aria-pressed', 'true');

        // Act
        await pageObject.getSecurityCameraTiles().nth(1).click();

        // Assert
        await expect(pageObject.getSecurityCamerasSingleView()).toBeVisible();
        await expect(pageObject.getSecurityCamerasSingleViewButton()).toHaveAttribute('aria-pressed', 'true');
        await expect(pageObject.getSecurityCameraSingleViewName()).toHaveText('Camera #2');

        await pageObject.getSecurityCamerasGridViewButton().click();
        await expect(pageObject.getSecurityCamerasGridView()).toBeVisible();
        await expect(pageObject.getSecurityCamerasGridViewButton()).toHaveAttribute('aria-pressed', 'true');
    });

    test('Toggle migrated player controls', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getPlayerCard()).toBeVisible();
        await expect(pageObject.getPlayerTrackName()).not.toBeEmpty();
        await expect(pageObject.getPlayerPlayButton()).toBeVisible();

        // Act
        await pageObject.getPlayerShuffleButton().click();
        await expect(pageObject.getPlayerShuffleButton()).toHaveAttribute('aria-pressed', 'true');

        await pageObject.getPlayerLoopButton().click();

        // Assert
        await expect(pageObject.getPlayerLoopButton()).toHaveAttribute('aria-pressed', 'true');
    });

    test('Change migrated traffic period', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTrafficCard()).toBeVisible();

        // Act
        await pageObject.getTrafficPeriodSelect().selectOption('year');

        // Assert
        await expect(pageObject.getTrafficPeriodSelect()).toHaveValue('year');
    });

    test('Switch migrated contacts panels', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getContactsCard()).toBeVisible();
        await expect(pageObject.getContactsPanel('contacts')).toBeVisible();
        await expect(pageObject.getContactRows('contacts')).toHaveCount(6);
        await expect(pageObject.getContactRows('contacts').first()).toContainText('Nick Jones');

        // Act
        await pageObject.getContactsTab('recent').click();

        // Assert
        await expect(pageObject.getContactsPanel('recent')).toBeVisible();
        await expect(pageObject.getContactRows('recent')).toHaveCount(8);
        await expect(pageObject.getContactRows('recent').first()).toContainText('Alan Thompson');
    });

    test('Change migrated electricity comparison state', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getElectricityWidget()).toBeVisible();
        await expect(pageObject.getElectricityYearTabs()).toHaveCount(3);

        // Act
        await pageObject.getElectricityYearTabs().nth(1).click();
        await expect(pageObject.getElectricityYearTabs().nth(1)).toHaveAttribute('aria-pressed', 'true');

        await pageObject.getElectricityPeriodSelect().selectOption('month');

        // Assert
        await expect(pageObject.getElectricityPeriodSelect()).toHaveValue('month');
    });

    test('Render and toggle migrated status cards', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getStatusCards()).toHaveCount(4);

        const lightCard = pageObject.getStatusCard('light');
        await expect(lightCard).toContainText('ON');

        // Act
        await lightCard.click();

        // Assert
        await expect(lightCard).toContainText('OFF');

        const coffeeMakerCard = pageObject.getStatusCard('coffee-maker');
        await expect(coffeeMakerCard).toBeVisible();
    });

    test('Switch migrated temperature panels and modes', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTemperatureCard()).toBeVisible();
        await expect(pageObject.getTemperaturePanel('temperature')).toBeVisible();

        // Act
        await pageObject.getModeButton('temperature', 'fan').click();
        await expect(pageObject.getModeButton('temperature', 'fan')).toHaveAttribute('aria-pressed', 'true');

        await pageObject.getTemperatureTab('humidity').click();
        await expect(pageObject.getTemperaturePanel('humidity')).toBeVisible();

        await pageObject.getModeButton('humidity', 'cool').click();

        // Assert
        await expect(pageObject.getModeButton('humidity', 'cool')).toHaveAttribute('aria-pressed', 'true');
    });
});