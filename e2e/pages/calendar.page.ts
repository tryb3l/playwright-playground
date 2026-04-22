import { Locator, Page } from '@playwright/test';
import { HeaderComponent, type ThemeName } from '@components/navbar/header.component';

type CalendarVariant = 'inline' | 'range' | 'custom';
type RangeBoundary = 'start' | 'end';

type CalendarSelectionSummary = {
    inline: string;
    rangeStart: string;
    rangeEnd: string;
    custom: string;
    customCaption: string;
    activeRangeBoundary: RangeBoundary;
    rangeHint: string;
};

type CalendarRangeState = {
    start: string;
    end: string;
    activeBoundary: RangeBoundary;
    hint: string;
};

export class CalendarPage {
    private _header: HeaderComponent | undefined;

    constructor(private readonly page: Page) { }

    private get header(): HeaderComponent {
        if (!this._header) {
            this._header = new HeaderComponent(this.page);
        }

        return this._header;
    }

    getThemeHost(): Locator {
        return this.page.locator('html');
    }

    getSelectedThemeValue(): Locator {
        return this.header.getSelectedThemeValue();
    }

    getCard(variant: CalendarVariant): Locator {
        return this.page.getByTestId(`calendar-${variant}-card`);
    }

    getCalendar(variant: CalendarVariant): Locator {
        return this.page.getByTestId(`calendar-${variant}`);
    }

    getPreviewValue(variant: 'inline' | 'custom'): Locator {
        return this.page.getByTestId(`calendar-${variant}-preview-value`);
    }

    getRangeValue(boundary: RangeBoundary): Locator {
        return this.page.getByTestId(`calendar-range-${boundary}-value`);
    }

    getRangeBoundaryButton(boundary: RangeBoundary): Locator {
        return this.page.getByTestId(`calendar-range-boundary-${boundary}`);
    }

    getRangeHint(): Locator {
        return this.page.getByTestId('calendar-range-hint');
    }

    getCustomCaption(): Locator {
        return this.page.getByTestId('calendar-custom-caption');
    }

    getResetButton(): Locator {
        return this.page.getByTestId('calendar-range-reset');
    }

    getSelectableDayButtons(variant: CalendarVariant): Locator {
        return this.getCalendar(variant).locator(
            'button.mat-calendar-body-cell:not(.mat-calendar-body-disabled):not(:has(.mat-calendar-body-selected))',
        );
    }

    getDayCellContent(variant: CalendarVariant, index: number = 0): Locator {
        return this.getCalendar(variant).locator(
            'button.mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content',
        ).nth(index);
    }

    async getSelectionSummary(): Promise<CalendarSelectionSummary> {
        return {
            inline: await this.readText(this.getPreviewValue('inline')),
            rangeStart: await this.readText(this.getRangeValue('start')),
            rangeEnd: await this.readText(this.getRangeValue('end')),
            custom: await this.readText(this.getPreviewValue('custom')),
            customCaption: await this.readText(this.getCustomCaption()),
            activeRangeBoundary: await this.getActiveRangeBoundary(),
            rangeHint: await this.readText(this.getRangeHint()),
        };
    }

    async getRangeState(): Promise<CalendarRangeState> {
        return {
            start: await this.readText(this.getRangeValue('start')),
            end: await this.readText(this.getRangeValue('end')),
            activeBoundary: await this.getActiveRangeBoundary(),
            hint: await this.readText(this.getRangeHint()),
        };
    }

    async setRangeBoundary(boundary: RangeBoundary): Promise<void> {
        await this.getRangeBoundaryButton(boundary).click();
    }

    async updateRangeBoundaryWithDifferentDay(
        boundary: RangeBoundary,
        index: number | 'last' = 0
    ): Promise<void> {
        await this.setRangeBoundary(boundary);

        const targetIndex = index === 'last'
            ? Math.max((await this.getSelectableDayButtons('range').count()) - 1, 0)
            : index;

        await this.selectDifferentDay('range', targetIndex);
    }

    async resetRangeSelection(): Promise<void> {
        await this.getResetButton().click();
    }

    async selectTheme(themeName: ThemeName): Promise<void> {
        await this.header.selectTheme(themeName);
    }

    async getStoredTheme(): Promise<string | null> {
        return this.page.evaluate(() => localStorage.getItem('ngx-admin.app-theme'));
    }

    async reload(): Promise<void> {
        await this.page.reload();
    }

    async selectDifferentDay(variant: CalendarVariant, index: number = 0): Promise<void> {
        await this.getSelectableDayButtons(variant).nth(index).click();
    }

    private async getActiveRangeBoundary(): Promise<RangeBoundary> {
        const startPressed = await this.getRangeBoundaryButton('start').getAttribute('aria-pressed');
        return startPressed === 'true' ? 'start' : 'end';
    }

    private async readText(locator: Locator): Promise<string> {
        return ((await locator.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    }
}

export type { CalendarSelectionSummary, CalendarRangeState };