import { BrowserContext } from '@playwright/test';
import { Authentication } from '@utils/auth';
import { Logger } from '@utils/logger';
import { promises as fs } from 'fs';
import path from 'path';

export class Users {
  private logger: Logger;
  private defaultUser = {
    email: 'defaultuser@example.com',
    password: 'DefaultPassword123!',
  };

  constructor() {
    this.logger = new Logger('Users');
  }

  async getUserCredentials(): Promise<{ email: string; password: string }> {
    if (process.env.USE_DEFAULT_USER === 'true') {
      return this.defaultUser;
    } else if (process.env.USE_USER_FROM_FILE === 'true') {
      return this.loadUserFromFile('playwright/.auth/user.json');
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
    const auth = new Authentication(page);

    if (shouldRegister) {
      await auth.registerUser(email, password);
    }

    await auth.loginUser(email, password);
    await page.close();
  }

  private async loadUserFromFile(
    filePath: string
  ): Promise<{ email: string; password: string }> {
    try {
      const absolutePath = path.resolve(filePath);
      const data = await fs.readFile(absolutePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Failed to load user from file: ${error}`);
      throw error;
    }
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