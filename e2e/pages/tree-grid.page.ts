import { Locator, Page } from '@playwright/test';

type TreeGridColumn = 'Name' | 'Size' | 'Kind' | 'Items';
type TreeGridSortDirection = 'asc' | 'desc';

type TreeGridRow = {
    name: string;
    size: string;
    kind: string;
    items: string;
};

export class TreeGridPage {
    constructor(private readonly page: Page) { }

    private get searchInput(): Locator {
        return this.page.getByTestId('tree-grid-search-input');
    }

    getTable(): Locator {
        return this.page.getByTestId('tree-grid-table');
    }

    private get rows(): Locator {
        return this.page.locator('[data-testid^="tree-grid-row-"]');
    }

    private getSortButton(column: TreeGridColumn): Locator {
        return this.getTable().locator('button.sort-button', { hasText: column });
    }

    private getToggleButton(name: string): Locator {
        return this.page.getByRole('button', {
            name: new RegExp(`^(Expand|Collapse) ${name}$`),
        });
    }

    async filterBy(query: string): Promise<void> {
        await this.searchInput.fill(query);
    }

    async sortBy(column: TreeGridColumn, direction: TreeGridSortDirection = 'asc'): Promise<void> {
        const button = this.getSortButton(column);
        await button.click();

        if (direction === 'desc') {
            await button.click();
        }
    }

    async toggleDirectory(name: string): Promise<void> {
        await this.getToggleButton(name).click();
    }

    async getVisibleRowCount(): Promise<number> {
        return this.rows.count();
    }

    async getVisibleRows(): Promise<TreeGridRow[]> {
        const rowCount = await this.rows.count();
        const rows: TreeGridRow[] = [];

        for (let index = 0; index < rowCount; index += 1) {
            const row = this.rows.nth(index);
            rows.push({
                name: (await row.locator('.column-name .tree-cell').innerText()).replace(/\s+/g, ' ').trim(),
                size: (await row.locator('.column-size').innerText()).trim(),
                kind: (await row.locator('.column-kind').innerText()).trim(),
                items: (await row.locator('.column-items').innerText()).trim(),
            });
        }

        return rows;
    }

    async getVisibleNames(): Promise<string[]> {
        const rows = await this.getVisibleRows();
        return rows.map((row) => row.name);
    }
}

export type { TreeGridRow };