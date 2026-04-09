import { Locator, Page } from '@playwright/test';

export class EchartsPage {
    constructor(private readonly page: Page) { }

    getCards(): Locator {
        return this.page.locator('[data-testid^="echart-card-"]');
    }

    getCard(testId: string): Locator {
        return this.page.getByTestId(testId);
    }

    getRenderedCharts(): Locator {
        return this.page.locator('.echart');
    }
}