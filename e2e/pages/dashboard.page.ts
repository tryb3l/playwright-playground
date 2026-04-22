import { Locator, Page } from '@playwright/test';

type ContactsPanel = 'contacts' | 'recent';
type TemperaturePanel = 'temperature' | 'humidity';
type TemperatureMode = 'cool' | 'warm' | 'heat' | 'fan';
type TrafficPeriod = 'week' | 'month' | 'year';

type SecurityCameraState = {
    view: 'grid' | 'single';
    cameraCount: number;
    selectedCameraName: string | null;
};

type PlayerState = {
    trackName: string;
    shuffleEnabled: boolean;
    loopEnabled: boolean;
    playing: boolean;
};

type ContactsState = {
    activePanel: ContactsPanel;
    visibleNames: string[];
};

type ElectricityState = {
    availableYears: string[];
    activeYear: string;
    period: string;
};

type TemperatureState = {
    activePanel: TemperaturePanel;
    temperatureMode: TemperatureMode;
    humidityMode: TemperatureMode;
};

const temperatureModes: TemperatureMode[] = ['cool', 'warm', 'heat', 'fan'];

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

    async selectRoom(roomId: string): Promise<void> {
        await this.getRoomSelectorRoomHitbox(roomId).click();
    }

    async getSelectedRoomId(): Promise<string> {
        const testId = await this.page
            .locator('[data-testid^="dashboard-room-selector-room-"].selected-room')
            .first()
            .getAttribute('data-testid');

        return testId?.replace('dashboard-room-selector-room-', '') ?? '';
    }

    async openSecurityCamera(index: number): Promise<void> {
        await this.getSecurityCameraTiles().nth(index).click();
    }

    async showSecurityCameraGrid(): Promise<void> {
        await this.getSecurityCamerasGridViewButton().click();
    }

    async getSecurityCameraState(): Promise<SecurityCameraState> {
        const isGridView = await this.isPressed(this.getSecurityCamerasGridViewButton());

        return {
            view: isGridView ? 'grid' : 'single',
            cameraCount: await this.getSecurityCameraTiles().count(),
            selectedCameraName: isGridView ? null : await this.readText(this.getSecurityCameraSingleViewName()),
        };
    }

    async togglePlayerShuffle(): Promise<void> {
        await this.getPlayerShuffleButton().click();
    }

    async togglePlayerLoop(): Promise<void> {
        await this.getPlayerLoopButton().click();
    }

    async getPlayerState(): Promise<PlayerState> {
        return {
            trackName: await this.readText(this.getPlayerTrackName()),
            shuffleEnabled: await this.isPressed(this.getPlayerShuffleButton()),
            loopEnabled: await this.isPressed(this.getPlayerLoopButton()),
            playing: await this.isPressed(this.getPlayerPlayButton()),
        };
    }

    async setTrafficPeriod(period: TrafficPeriod): Promise<void> {
        await this.getTrafficPeriodSelect().selectOption(period);
    }

    async getTrafficPeriod(): Promise<string> {
        return this.getTrafficPeriodSelect().inputValue();
    }

    async selectContactsPanel(panel: ContactsPanel): Promise<void> {
        await this.getContactsTab(panel).click();
    }

    async getContactsState(): Promise<ContactsState> {
        const activePanel = (await this.isTabSelected(this.getContactsTab('recent')))
            ? 'recent'
            : 'contacts';
        const visibleNames = (await this.getContactRows(activePanel)
            .locator('.contact-name')
            .allTextContents())
            .map((name) => name.trim())
            .filter(Boolean);

        return {
            activePanel,
            visibleNames,
        };
    }

    async selectElectricityYearByIndex(index: number): Promise<void> {
        await this.getElectricityYearTabs().nth(index).click();
    }

    async setElectricityPeriod(period: TrafficPeriod): Promise<void> {
        await this.getElectricityPeriodSelect().selectOption(period);
    }

    async getElectricityState(): Promise<ElectricityState> {
        const yearTabs = this.getElectricityYearTabs();
        const yearCount = await yearTabs.count();
        const availableYears: string[] = [];
        let activeYear = '';

        for (let index = 0; index < yearCount; index += 1) {
            const tab = yearTabs.nth(index);
            const year = await this.readText(tab);
            availableYears.push(year);

            if (await this.isPressed(tab)) {
                activeYear = year;
            }
        }

        return {
            availableYears,
            activeYear,
            period: await this.getElectricityPeriodSelect().inputValue(),
        };
    }

    async getStatusCardCount(): Promise<number> {
        return this.getStatusCards().count();
    }

    async toggleStatusCard(slug: string): Promise<void> {
        await this.getStatusCard(slug).click();
    }

    async getStatusCardStatus(slug: string): Promise<string> {
        return this.readText(this.getStatusCard(slug).locator('.status'));
    }

    async selectTemperaturePanel(panel: TemperaturePanel): Promise<void> {
        await this.getTemperatureTab(panel).click();
    }

    async selectTemperatureMode(
        panel: TemperaturePanel,
        mode: TemperatureMode
    ): Promise<void> {
        await this.getModeButton(panel, mode).click();
    }

    async getTemperatureState(): Promise<TemperatureState> {
        return {
            activePanel: (await this.isTabSelected(this.getTemperatureTab('humidity')))
                ? 'humidity'
                : 'temperature',
            temperatureMode: await this.getActiveTemperatureMode('temperature'),
            humidityMode: await this.getActiveTemperatureMode('humidity'),
        };
    }

    private async getActiveTemperatureMode(
        panel: TemperaturePanel
    ): Promise<TemperatureMode> {
        for (const mode of temperatureModes) {
            const button = this.getModeButton(panel, mode);

            if ((await button.count()) === 0) {
                continue;
            }

            if (await this.isPressed(button)) {
                return mode;
            }
        }

        return 'cool';
    }

    private async isPressed(locator: Locator): Promise<boolean> {
        return (await locator.getAttribute('aria-pressed')) === 'true';
    }

    private async isTabSelected(locator: Locator): Promise<boolean> {
        return (await locator.getAttribute('aria-selected')) === 'true';
    }

    private async readText(locator: Locator): Promise<string> {
        return ((await locator.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    }
}

export type { ContactsState, ElectricityState, PlayerState, SecurityCameraState, TemperatureState };