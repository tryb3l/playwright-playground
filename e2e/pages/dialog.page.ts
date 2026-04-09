import { Locator, Page } from '@playwright/test';

export class DialogPage {
    constructor(private readonly page: Page) { }

    async openNamePrompt(): Promise<void> {
        await this.page.getByTestId('dialog-enter-name-button').click();
    }

    async fillName(name: string): Promise<void> {
        await this.page.getByTestId('dialog-name-input').fill(name);
    }

    async submitName(): Promise<void> {
        await this.page.getByTestId('dialog-submit-button').click();
    }

    getListedName(name: string): Locator {
        return this.page.getByTestId('dialog-name-list').getByText(name, {
            exact: true,
        });
    }
}