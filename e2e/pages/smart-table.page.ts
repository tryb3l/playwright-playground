import { Locator, Page } from '@playwright/test';

export class SmartTablePage {
    constructor(private readonly page: Page) { }

    getCard(): Locator {
        return this.page.getByTestId('smart-table-card');
    }

    getTable(): Locator {
        return this.getCard().locator('angular2-smart-table table');
    }

    getRows(): Locator {
        return this.getTable().locator('tbody tr');
    }

    getHeader(title: string): Locator {
        return this.getTable().locator('a.angular2-smart-sort-link', { hasText: title });
    }

    getFilterInput(title: string): Locator {
        return this.getCard().getByPlaceholder(title);
    }

    getRowContaining(text: string): Locator {
        return this.getRows().filter({ hasText: text });
    }

    getPaginationNav(): Locator {
        return this.getCard().locator('.angular2-smart-pagination-nav');
    }

    getActivePage(): Locator {
        return this.getPaginationNav().locator(
            '.angular2-smart-page-item.active .angular2-smart-page-link'
        );
    }

    getPageLink(pageNumber: number): Locator {
        return this.getPaginationNav().getByRole('link', {
            name: String(pageNumber),
            exact: true,
        });
    }

    async filterBy(title: string, value: string): Promise<void> {
        const input = this.getFilterInput(title);
        await input.click();
        await input.fill('');
        await input.pressSequentially(value);
        await input.blur();
    }

    async sortBy(title: string, direction: 'asc' | 'desc' = 'asc'): Promise<void> {
        const header = this.getHeader(title);
        await header.click();

        if (direction === 'desc') {
            await header.click();
        }
    }

    async goToPage(pageNumber: number): Promise<void> {
        await this.getPageLink(pageNumber).click();
    }
}