import { Locator, Page } from '@playwright/test';
import { Logger } from '@utils/logger';
import { LogExecution } from '@utils/decorators';

export abstract class BaseComponent {
  protected page: Page;
  protected logger: Logger;
  protected context: Page | Locator;
  constructor(page: Page, componentName?: string) {
    this.page = page;
    this.context = page;
    this.logger = new Logger(componentName || this.constructor.name);
  }

  // Generic methods applicable to all components

  @LogExecution
  async click(selector: string) {
    await this.context.click(selector);
  }

  @LogExecution
  async fill(selector: string, value: string) {
    await this.context.locator(selector).fill(value);
  }

  @LogExecution
  async getText(selector: string): Promise<string> {
    const text = await this.context.textContent(selector);
    if (text === null) {
      throw new Error(`No text content found for selector: ${selector}`);
    }
    return text;
  }

  @LogExecution
  async isVisible(selector: string): Promise<boolean> {
    return await this.context.isVisible(selector);
  }

  @LogExecution
  async waitForSelector(selector: string, options?: { timeout?: number }) {
    await this.context.waitForSelector(selector, options);
  }
}
