import { Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { Logger } from '@utils/logger';

export class Authentication extends BaseComponent {
    private logger: Logger;

    constructor(page: Page){
        super(page);
        this.logger = new Logger('Authentication');
    }

    async registerUser(email: string, password: string) {
        this.logger.info(`Registering user: ${email}`);
        await this.page.goto('/auth/register');
        await this.fillInputByLabel('Email', email);
        await this.fillInputByLabel('Password', password);
        await this.clickButtonByText('Register');
        await this.page.waitForNavigation();
        this.logger.info(`User registered: ${email}`);
      }

      async loginUser(email: string, password: string) {
        this.logger.info(`Logging in user: ${email}`);
        await this.page.goto('/auth/login');
        await this.fillInputByLabel('Email', email);
        await this.fillInputByLabel('Password', password);
        await this.clickButtonByText('Sign in');
        await this.page.waitForNavigation();
        this.logger.info(`User logged in: ${email}`);
      }
}