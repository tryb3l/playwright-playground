import { Locator, Page } from '@playwright/test';

export class TreeGridPage {
    constructor(private readonly page: Page) { }

    async search(query: string): Promise<void> {
        await this.page.getByTestId('tree-grid-search-input').fill(query);
    }

    getTable(): Locator {
        return this.page.getByTestId('tree-grid-table');
    }

    getRows(): Locator {
        return this.page.locator('[data-testid^="tree-grid-row-"]');
    }

    getRowContaining(text: string): Locator {
        return this.getRows().filter({ hasText: text });
    }
}