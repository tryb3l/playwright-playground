import type { Page } from '@playwright/test';
import { FormComponent } from '@components/forms/base/base.form.component';
import { Logger } from '@utils/logger';

export class Authentication extends FormComponent {
  protected logger: Logger;

  constructor(page: Page) {
    super(page, 'form.auth-form');
    this.logger = new Logger('Authentication');
  }

  async registerUser(email: string, password: string) {
    this.logger.info(`Registering user: ${email}`);
    await this.page.goto('/auth/register');
    await this.fill('input', 'Demo User', { byTestId: 'auth-full-name-input' });
    await this.fill('input', email, { byTestId: 'auth-email-input' });
    await this.fill('input', password, { byTestId: 'auth-password-input' });
    await this.fill('input', password, { byTestId: 'auth-confirm-password-input' });
    await this.click('button', { byTestId: 'auth-submit-button' });
    this.logger.info(`User registered: ${email}`);
  }

  async loginUser(email: string, password: string) {
    this.logger.info(`Logging in user: ${email}`);
    await this.page.goto('/auth/login');
    await this.fill('input', email, { byTestId: 'auth-email-input' });
    await this.fill('input', password, { byTestId: 'auth-password-input' });
    await this.click('button', { byTestId: 'auth-submit-button' });
    this.logger.info(`User logged in: ${email}`);
  }
}
