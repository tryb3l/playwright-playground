import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const test = createTestForStartPage(StartPage.IoTDashboard);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Dashboard Smoke Tests', () => {
    test('Render dashboard shell widgets', async ({ pageObject }) => {
        // Arrange
        const expectedKittenDescription = 'UI Kitten';

        // Act
        const kittenDescription = pageObject.getKittenDescription();

        // Assert
        await expect(pageObject.getLivingLayout()).toBeVisible();
        await expect(pageObject.getMainColumn()).toBeVisible();
        await expect(pageObject.getSidebarColumn()).toBeVisible();
        await expect(pageObject.getRoomSelectorCard()).toBeVisible();
        await expect(pageObject.getRoomsCard()).toBeVisible();
        await expect(pageObject.getSolarCard()).toBeVisible();
        await expect(pageObject.getWeatherCard()).toBeVisible();
        await expect(pageObject.getKittenCard()).toBeVisible();
        await expect(kittenDescription).toContainText(expectedKittenDescription);
    });
});

test.describe('Dashboard Behavior Tests', () => {
    test('Switch migrated room selector state', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getRoomSelectorCard()).toBeVisible();
        await expect.poll(() => pageObject.getSelectedRoomId()).toBe('2');

        // Act
        await pageObject.selectRoom('0');

        // Assert
        await expect.poll(() => pageObject.getSelectedRoomId()).toBe('0');
    });

    test('Switch migrated security cameras views', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getSecurityCamerasCard()).toBeVisible();

        const initialState = await pageObject.getSecurityCameraState();

        expect(initialState).toEqual({
            view: 'grid',
            cameraCount: 4,
            selectedCameraName: null,
        });

        // Act
        await pageObject.openSecurityCamera(1);
        const singleViewState = await pageObject.getSecurityCameraState();
        await pageObject.showSecurityCameraGrid();
        const restoredGridState = await pageObject.getSecurityCameraState();

        // Assert
        expect(singleViewState.view).toBe('single');
        expect(singleViewState.selectedCameraName).toBe('Camera #2');
        expect(restoredGridState).toEqual(initialState);
    });

    test('Toggle migrated player controls', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getPlayerCard()).toBeVisible();

        const initialState = await pageObject.getPlayerState();
        expect(initialState.trackName).not.toBe('');

        // Act
        await pageObject.togglePlayerShuffle();
        await pageObject.togglePlayerLoop();
        const updatedPlayerState = await pageObject.getPlayerState();

        // Assert
        expect(updatedPlayerState.shuffleEnabled).toBe(true);
        expect(updatedPlayerState.loopEnabled).toBe(true);
    });

    test('Change migrated traffic period', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTrafficCard()).toBeVisible();

        // Act
        await pageObject.setTrafficPeriod('year');

        // Assert
        await expect.poll(() => pageObject.getTrafficPeriod()).toBe('year');
    });

    test('Switch migrated contacts panels', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getContactsCard()).toBeVisible();

        const initialState = await pageObject.getContactsState();
        expect(initialState.activePanel).toBe('contacts');
        expect(initialState.visibleNames).toHaveLength(6);
        expect(initialState.visibleNames[0]).toBe('Nick Jones');

        // Act
        await pageObject.selectContactsPanel('recent');
        const recentState = await pageObject.getContactsState();

        // Assert
        expect(recentState.activePanel).toBe('recent');
        expect(recentState.visibleNames).toHaveLength(8);
        expect(recentState.visibleNames[0]).toBe('Alan Thompson');
    });

    test('Change migrated electricity comparison state', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getElectricityWidget()).toBeVisible();

        const initialState = await pageObject.getElectricityState();
        expect(initialState.availableYears).toHaveLength(3);
        const targetYear = initialState.availableYears[1];

        // Act
        await pageObject.selectElectricityYearByIndex(1);
        await pageObject.setElectricityPeriod('month');
        const updatedElectricityState = await pageObject.getElectricityState();

        // Assert
        expect(updatedElectricityState.activeYear).toBe(targetYear);
        expect(updatedElectricityState.period).toBe('month');
    });

    test('Render and toggle migrated status cards', async ({ pageObject }) => {
        // Arrange
        await expect.poll(() => pageObject.getStatusCardCount()).toBe(4);
        await expect.poll(() => pageObject.getStatusCardStatus('light')).toBe('ON');

        // Act
        await pageObject.toggleStatusCard('light');
        const updatedLightStatus = await pageObject.getStatusCardStatus('light');

        // Assert
        expect(updatedLightStatus).toBe('OFF');
        await expect(pageObject.getStatusCard('coffee-maker')).toBeVisible();
    });

    test('Switch migrated temperature panels and modes', async ({ pageObject }) => {
        // Arrange
        await expect(pageObject.getTemperatureCard()).toBeVisible();

        const initialState = await pageObject.getTemperatureState();
        expect(initialState.activePanel).toBe('temperature');

        // Act
        await pageObject.selectTemperatureMode('temperature', 'fan');
        const temperatureStateAfterModeChange = await pageObject.getTemperatureState();
        await pageObject.selectTemperaturePanel('humidity');
        await pageObject.selectTemperatureMode('humidity', 'cool');
        const updatedTemperatureState = await pageObject.getTemperatureState();

        // Assert
        expect(temperatureStateAfterModeChange.temperatureMode).toBe('fan');
        expect(updatedTemperatureState.activePanel).toBe('humidity');
        expect(updatedTemperatureState.humidityMode).toBe('cool');
    });
});