import { BrowserContext } from '@playwright/test';
import { AuthPage } from '@pages/auth.page';
import { Logger } from '@utils/logger';
import { promises as fs } from 'fs';
import path from 'path';

type UserCredentials = {
  email: string;
  password: string;
};

export class Users {
  private logger: Logger;
  private defaultUser: UserCredentials = {
    email: 'defaultuser@example.com',
    password: 'DefaultPassword123!',
  };

  constructor() {
    this.logger = new Logger('Users');
  }

  async getUserCredentials(): Promise<UserCredentials> {
    if (process.env.USE_DEFAULT_USER === 'true') {
      return this.defaultUser;
    } else if (process.env.USE_USER_FROM_FILE === 'true') {
      const credentialsFilePath = process.env.USER_CREDENTIALS_FILE;

      if (!credentialsFilePath) {
        throw new Error(
          'USE_USER_FROM_FILE=true requires USER_CREDENTIALS_FILE to point to a JSON file with email and password fields.'
        );
      }

      return this.loadUserFromFile(credentialsFilePath);
    } else {
      const email = `testuser_${Date.now()}@example.com`;
      const password = 'TestPassword123!';
      return { email, password };
    }
  }

  async authenticateUser(
    context: BrowserContext,
    email: string,
    password: string,
    shouldRegister: boolean = false
  ): Promise<void> {
    const page = await context.newPage();
    const authPage = new AuthPage(page);

    if (shouldRegister) {
      await authPage.registerThroughUi('Demo User', email, password);
    } else {
      await authPage.loginThroughUi(email, password);
    }

    await page.close();
  }

  private async loadUserFromFile(
    filePath: string
  ): Promise<UserCredentials> {
    const absolutePath = path.resolve(filePath);
    const data = await fs.readFile(absolutePath, 'utf-8');
    const parsedData = JSON.parse(data) as Partial<UserCredentials>;

    if (
      typeof parsedData.email !== 'string' ||
      typeof parsedData.password !== 'string'
    ) {
      throw new Error(
        `Credentials file "${absolutePath}" must contain string "email" and "password" fields. Do not point USER_CREDENTIALS_FILE at a Playwright storage state file like playwright/.auth/user.json.`
      );
    }

    return {
      email: parsedData.email,
      password: parsedData.password,
    };
  }

  async deleteUser(email: string): Promise<void> {
    this.logger.info(`Deleting user: ${email}`);
    //TODO: Implement user deletion logic if necessary
  }

  async getAccessToken(email: string, password: string): Promise<string> {
    //TODO Implement API call to get the access token
    return 'mockedAccessToken';
  }
}
