import { Locator, Page } from '@playwright/test';

export class DialogPage {
    constructor(private readonly page: Page) { }

    getSubmittedName(name: string): Locator {
        return this.page.getByTestId('dialog-name-list').getByText(name, {
            exact: true,
        });
    }

    async submitNamePrompt(name: string): Promise<void> {
        await this.page.getByTestId('dialog-enter-name-button').click();
        await this.page.getByTestId('dialog-name-input').fill(name);
        await this.page.getByTestId('dialog-submit-button').click();
    }
}