import { Locator, Page } from '@playwright/test';

type WindowDraft = {
    subject: string;
    text: string;
};

type WindowCopy = {
    title: string;
    content: string;
};

export class WindowPage {
    constructor(private readonly page: Page) { }

    private get openFormButton(): Locator {
        return this.page.getByTestId('window-open-form-button');
    }

    private get openNoBackdropButton(): Locator {
        return this.page.getByTestId('window-open-no-backdrop-button');
    }

    private get dialogs(): Locator {
        return this.page.locator('mat-dialog-container');
    }

    private get activeDialog(): Locator {
        return this.dialogs.last();
    }

    async openWindowForm(): Promise<void> {
        await Promise.all([
            this.subjectInput.waitFor(),
            this.openFormButton.click(),
        ]);
    }

    async openWindowWithoutBackdrop(): Promise<void> {
        await Promise.all([
            this.activeDialog.waitFor(),
            this.openNoBackdropButton.click(),
        ]);
    }

    private get subjectInput(): Locator {
        return this.page.getByTestId('window-subject-input');
    }

    private get textInput(): Locator {
        return this.page.locator('textarea#text');
    }

    private get dialogTitle(): Locator {
        return this.activeDialog.locator('[mat-dialog-title], mat-dialog-title');
    }

    private get dialogContent(): Locator {
        return this.activeDialog.locator('mat-dialog-content');
    }

    private get closeButton(): Locator {
        return this.activeDialog.getByRole('button', { name: 'Close Window' });
    }

    async fillWindowForm(subject: string, text: string): Promise<void> {
        await this.subjectInput.fill(subject);
        await this.textInput.fill(text);
    }

    async getOpenWindowCount(): Promise<number> {
        return this.dialogs.count();
    }

    async getWindowFormDraft(): Promise<WindowDraft> {
        return {
            subject: await this.subjectInput.inputValue(),
            text: await this.textInput.inputValue(),
        };
    }

    async getActiveWindowCopy(): Promise<WindowCopy> {
        return {
            title: (await this.dialogTitle.textContent()) ?? '',
            content: (await this.dialogContent.textContent()) ?? '',
        };
    }

    async canOpenWindowForm(): Promise<boolean> {
        return this.openFormButton.isVisible();
    }

    async closeActiveWindow(): Promise<void> {
        await this.closeButton.click();
    }

    async pressEscape(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }
}