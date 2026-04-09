import { Locator, Page } from '@playwright/test';

export class WindowPage {
    constructor(private readonly page: Page) { }

    getOpenFormButton(): Locator {
        return this.page.getByTestId('window-open-form-button');
    }

    getOpenNoBackdropButton(): Locator {
        return this.page.getByTestId('window-open-no-backdrop-button');
    }

    getDialogs(): Locator {
        return this.page.locator('mat-dialog-container');
    }

    getActiveDialog(): Locator {
        return this.getDialogs().last();
    }

    async openWindowForm(): Promise<void> {
        await this.getOpenFormButton().click();
    }

    async openWindowWithoutBackdrop(): Promise<void> {
        await this.getOpenNoBackdropButton().click();
    }

    getSubjectInput(): Locator {
        return this.page.getByTestId('window-subject-input');
    }

    getTextInput(): Locator {
        return this.page.locator('textarea#text');
    }

    getTemplateContent(): Locator {
        return this.page.getByTestId('window-template-content');
    }

    getDialogTitle(): Locator {
        return this.getActiveDialog().locator('[mat-dialog-title], mat-dialog-title');
    }

    getDialogContent(): Locator {
        return this.getActiveDialog().locator('mat-dialog-content');
    }

    getCloseButton(): Locator {
        return this.getActiveDialog().getByRole('button', { name: 'Close Window' });
    }

    getNoBackdropCloseButton(): Locator {
        return this.page.getByTestId('window-close-button');
    }

    async fillWindowForm(subject: string, text: string): Promise<void> {
        await this.getSubjectInput().fill(subject);
        await this.getTextInput().fill(text);
    }

    async closeWindowForm(): Promise<void> {
        await this.getCloseButton().click();
    }

    async closeNoBackdropWindow(): Promise<void> {
        await this.getNoBackdropCloseButton().click();
    }

    async pressEscape(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }
}