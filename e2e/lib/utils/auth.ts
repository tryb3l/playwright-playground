import type { Page } from '@playwright/test';
import { FormComponent } from '@components/forms/base/base.form.component';
import { ButtonComponent } from '../components/button/button.component';
import { Logger } from '@utils/logger';

export class Authentication extends FormComponent {
  protected logger: Logger;
  protected buttonComponent: ButtonComponent;

  constructor(page: Page) {
    super(page, 'form.ng-pristine.ng-invalid');
    this.buttonComponent = new ButtonComponent(page, 'button');
    this.logger = new Logger('Authentication');
  }

  async registerUser(email: string, password: string) {
    this.logger.info(`Registering user: ${email}`);
    await this.page.goto('/auth/register');
    await this.fillInputByLabel('Email', email);
    await this.fillInputByLabel('Password', password);
    await this.buttonComponent.clickButtonByText('Register');
    this.logger.info(`User registered: ${email}`);
  }

  async loginUser(email: string, password: string) {
    this.logger.info(`Logging in user: ${email}`);
    await this.page.goto('/auth/login');
    await this.fillInputByLabel('Email', email);
    await this.fillInputByLabel('Password', password);
    await this.buttonComponent.clickButtonByText('Sign in');
    this.logger.info(`User logged in: ${email}`);
  }
}
