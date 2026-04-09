import { Locator, Page } from '@playwright/test';

type CalendarVariant = 'inline' | 'range' | 'custom';
type RangeBoundary = 'start' | 'end';

export class CalendarPage {
    constructor(private readonly page: Page) { }

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

    async selectDifferentDay(variant: CalendarVariant, index: number = 0): Promise<void> {
        await this.getSelectableDayButtons(variant).nth(index).click();
    }
}