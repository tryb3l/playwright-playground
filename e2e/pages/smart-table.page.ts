import { Locator, Page } from '@playwright/test';

type SmartTableColumnTitle =
    | 'ID'
    | 'First Name'
    | 'Last Name'
    | 'Username'
    | 'E-mail'
    | 'Age';

type SmartTableSortDirection = 'asc' | 'desc';

type SmartTableRow = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    age: string;
};

export class SmartTablePage {
    constructor(private readonly page: Page) { }

    private get card(): Locator {
        return this.page.getByTestId('smart-table-card');
    }

    getTable(): Locator {
        return this.card.locator('angular2-smart-table table');
    }

    private get rows(): Locator {
        return this.getTable().locator('tbody tr');
    }

    private getPaginationNav(): Locator {
        return this.card.locator('.angular2-smart-pagination-nav');
    }

    private getHeader(title: SmartTableColumnTitle): Locator {
        return this.getTable().locator('a.angular2-smart-sort-link', { hasText: title });
    }

    private getFilterInput(title: SmartTableColumnTitle): Locator {
        return this.card.getByPlaceholder(title);
    }

    private getPageItem(pageNumber: number): Locator {
        return this.getPaginationNav().locator('.angular2-smart-page-item.page-item').filter({
            hasText: new RegExp(`^\\s*${pageNumber}(?:\\s*\\(current\\))?\\s*$`),
        });
    }

    private getPageLink(pageNumber: number): Locator {
        return this.getPaginationNav().getByRole('link', {
            name: String(pageNumber),
            exact: true,
        });
    }

    async getVisibleRowCount(): Promise<number> {
        return this.rows.count();
    }

    async getVisibleEmails(): Promise<string[]> {
        const rowCount = await this.rows.count();
        const emails: string[] = [];

        for (let index = 0; index < rowCount; index += 1) {
            const row = await this.getVisibleRow(index);
            emails.push(row.email);
        }

        return emails;
    }

    async getVisibleRow(index: number): Promise<SmartTableRow> {
        const cellTexts = (await this.rows
            .nth(index)
            .locator('td')
            .allInnerTexts())
            .map((text) => text.replace(/\s+/g, ' ').trim())
            .filter(Boolean)
            .slice(0, 6);

        const [id = '', firstName = '', lastName = '', username = '', email = '', age = ''] = cellTexts;

        return {
            id,
            firstName,
            lastName,
            username,
            email,
            age,
        };
    }

    async isPageActive(pageNumber: number): Promise<boolean> {
        return this.getPageItem(pageNumber).evaluate((element) =>
            element.classList.contains('active')
        );
    }

    async filterBy(title: SmartTableColumnTitle, value: string): Promise<void> {
        const input = this.getFilterInput(title);
        await input.click();
        await input.fill('');
        await input.pressSequentially(value);
        await input.blur();
    }

    async filterByFirstName(value: string): Promise<void> {
        await this.filterBy('First Name', value);
    }

    async sortBy(title: SmartTableColumnTitle, direction: SmartTableSortDirection = 'asc'): Promise<void> {
        const header = this.getHeader(title);
        await header.click();

        if (direction === 'desc') {
            await header.click();
        }
    }

    async sortByAge(direction: SmartTableSortDirection = 'asc'): Promise<void> {
        await this.sortBy('Age', direction);
    }

    async goToPage(pageNumber: number): Promise<void> {
        await this.getPageLink(pageNumber).click();
    }
}

export type { SmartTableRow };