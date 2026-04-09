import { Locator, Page } from '@playwright/test';

export class DashboardPage {
    constructor(private readonly page: Page) { }

    getRoomSelectorCard(): Locator {
        return this.page.getByTestId('dashboard-room-selector-card');
    }

    getRoomSelectorRoom(roomId: string): Locator {
        return this.page.getByTestId(`dashboard-room-selector-room-${roomId}`);
    }

    getRoomSelectorRoomHitbox(roomId: string): Locator {
        return this.page.getByTestId(`dashboard-room-selector-room-hitbox-${roomId}`);
    }

    getLivingLayout(): Locator {
        return this.page.getByTestId('dashboard-living-layout');
    }

    getMainColumn(): Locator {
        return this.page.getByTestId('dashboard-main-column');
    }

    getSidebarColumn(): Locator {
        return this.page.getByTestId('dashboard-sidebar-column');
    }

    getKittenCard(): Locator {
        return this.page.getByTestId('dashboard-kitten-card');
    }

    getKittenDescription(): Locator {
        return this.page.getByTestId('dashboard-kitten-description');
    }

    getSecurityCamerasCard(): Locator {
        return this.page.getByTestId('dashboard-security-cameras-card');
    }

    getSecurityCamerasGridViewButton(): Locator {
        return this.page.getByTestId('dashboard-security-cameras-grid-view-button');
    }

    getSecurityCamerasSingleViewButton(): Locator {
        return this.page.getByTestId('dashboard-security-cameras-single-view-button');
    }

    getSecurityCamerasGridView(): Locator {
        return this.page.getByTestId('dashboard-security-cameras-grid-view');
    }

    getSecurityCamerasSingleView(): Locator {
        return this.page.getByTestId('dashboard-security-cameras-single-view');
    }

    getSecurityCameraTiles(): Locator {
        return this.page.locator('[data-testid^="dashboard-security-camera-"]');
    }

    getSecurityCameraSingleViewName(): Locator {
        return this.page.locator('[data-testid="dashboard-security-cameras-single-view"] .camera-name');
    }

    getRoomsCard(): Locator {
        return this.page.getByTestId('dashboard-rooms-card');
    }

    getRoomsSelectorPane(): Locator {
        return this.page.getByTestId('dashboard-rooms-selector-pane');
    }

    getRoomsPlayerPane(): Locator {
        return this.page.getByTestId('dashboard-rooms-player-pane');
    }

    getPlayerCard(): Locator {
        return this.page.getByTestId('dashboard-player-card');
    }

    getPlayerTrackName(): Locator {
        return this.page.getByTestId('dashboard-player-track-name');
    }

    getPlayerShuffleButton(): Locator {
        return this.page.getByTestId('dashboard-player-shuffle-button');
    }

    getPlayerLoopButton(): Locator {
        return this.page.getByTestId('dashboard-player-loop-button');
    }

    getPlayerPlayButton(): Locator {
        return this.page.getByTestId('dashboard-player-play-button');
    }

    getSolarCard(): Locator {
        return this.page.getByTestId('dashboard-solar-card');
    }

    getSolarChartShell(): Locator {
        return this.page.getByTestId('dashboard-solar-chart-shell');
    }

    getTrafficCard(): Locator {
        return this.page.getByTestId('dashboard-traffic-card');
    }

    getTrafficChartSurface(): Locator {
        return this.page.getByTestId('dashboard-traffic-chart-surface');
    }

    getTrafficPeriodSelect(): Locator {
        return this.page.getByTestId('dashboard-traffic-period-select');
    }

    getWeatherCard(): Locator {
        return this.page.getByTestId('dashboard-weather-card');
    }

    getWeatherLocation(): Locator {
        return this.page.getByTestId('dashboard-weather-location');
    }

    getWeatherForecastDays(): Locator {
        return this.page.locator('[data-testid^="dashboard-weather-day-"]');
    }

    getContactsCard(): Locator {
        return this.page.getByTestId('dashboard-contacts-card');
    }

    getContactsTab(panel: 'contacts' | 'recent'): Locator {
        return this.page.getByTestId(`dashboard-contacts-tab-${panel}`);
    }

    getContactsPanel(panel: 'contacts' | 'recent'): Locator {
        return this.page.getByTestId(`dashboard-contacts-panel-${panel}`);
    }

    getContactRows(panel: 'contacts' | 'recent'): Locator {
        return panel === 'contacts'
            ? this.page.locator('[data-testid^="dashboard-contact-row-"]')
            : this.page.locator('[data-testid^="dashboard-recent-row-"]');
    }

    getElectricityWidget(): Locator {
        return this.page.getByTestId('dashboard-electricity-widget');
    }

    getElectricityChartCard(): Locator {
        return this.page.getByTestId('dashboard-electricity-chart-card');
    }

    getElectricityYearTabs(): Locator {
        return this.page.locator('button[data-testid^="dashboard-electricity-year-"]');
    }

    getElectricityPeriodSelect(): Locator {
        return this.page.getByTestId('dashboard-electricity-period-select');
    }

    getTemperatureCard(): Locator {
        return this.page.getByTestId('dashboard-temperature-card');
    }

    getTemperaturePanel(panel: 'temperature' | 'humidity'): Locator {
        return this.page.getByTestId(`dashboard-temperature-panel-${panel}`);
    }

    getTemperatureTab(panel: 'temperature' | 'humidity'): Locator {
        return this.page.getByTestId(`dashboard-temperature-tab-${panel}`);
    }

    getModeButton(panel: 'temperature' | 'humidity', mode: 'cool' | 'warm' | 'heat' | 'fan'): Locator {
        return this.page.getByTestId(`dashboard-${panel}-mode-${mode}`);
    }

    getStatusCards(): Locator {
        return this.page.locator('[data-testid^="dashboard-status-card-"]');
    }

    getStatusCard(slug: string): Locator {
        return this.page.getByTestId(`dashboard-status-card-${slug}`);
    }
}