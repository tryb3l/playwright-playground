import { Locator, Page } from '@playwright/test';

type AuthPageMode = 'login' | 'register' | 'request-password' | 'reset-password';

export class AuthPage {
    constructor(private readonly page: Page) { }

    getShell(): Locator {
        return this.page.getByTestId('auth-shell');
    }

    getPageSurface(mode: AuthPageMode): Locator {
        return this.page.getByTestId(`auth-page-${mode}`);
    }

    getTitle(): Locator {
        return this.page.locator('.auth-card__title');
    }

    getSubtitle(): Locator {
        return this.page.locator('.auth-card__subtitle');
    }

    getEmailInput(): Locator {
        return this.page.getByTestId('auth-email-input');
    }

    getPasswordInput(): Locator {
        return this.page.getByTestId('auth-password-input');
    }

    getConfirmPasswordInput(): Locator {
        return this.page.getByTestId('auth-confirm-password-input');
    }

    getFullNameInput(): Locator {
        return this.page.getByTestId('auth-full-name-input');
    }

    getRememberCheckbox(): Locator {
        return this.page.getByTestId('auth-remember-checkbox');
    }

    getSubmitButton(): Locator {
        return this.page.getByTestId('auth-submit-button');
    }

    getHelperLinks(): Locator {
        return this.page.locator('.auth-card__footer a');
    }

    getSocialLinks(): Locator {
        return this.page.locator('.auth-social__link');
    }

    getErrorAlert(): Locator {
        return this.page.getByTestId('auth-error-alert');
    }

    getSuccessAlert(): Locator {
        return this.page.getByTestId('auth-success-alert');
    }

    async login(email: string, password: string): Promise<void> {
        await this.getEmailInput().fill(email);
        await this.getPasswordInput().fill(password);
        await this.getSubmitButton().click();
    }

    async register(fullName: string, email: string, password: string): Promise<void> {
        await this.getFullNameInput().fill(fullName);
        await this.getEmailInput().fill(email);
        await this.getPasswordInput().fill(password);
        await this.getConfirmPasswordInput().fill(password);
        await this.getSubmitButton().click();
    }

    async requestPassword(email: string): Promise<void> {
        await this.getEmailInput().fill(email);
        await this.getSubmitButton().click();
    }

    async resetPassword(password: string): Promise<void> {
        await this.getPasswordInput().fill(password);
        await this.getConfirmPasswordInput().fill(password);
        await this.getSubmitButton().click();
    }
}