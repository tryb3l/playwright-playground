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

  // Base locator methods
  @LogExecution
  protected getByRole(role: string, options?: { name?: string }) {
    return this.context.getByRole(role, options);
  }

  @LogExecution
  protected getByLabel(label: string): Locator {
    return this.context.getByLabel(label);
  }

  @LogExecution
  protected getByPlaceholder(placeholder: string): Locator {
    return this.context.getByPlaceholder(placeholder);
  }

  @LogExecution
  protected getByTestId(testId: string): Locator {
    return this.context.getByTestId(testId);
  }

  // Generic methods applicable to all components

  @LogExecution
  async click(
    selector: string | Locator,
    options?: {
      byRole?: string;
      byLabel?: string;
      byTestId?: string;
    }
  ): Promise<void> {
    let locator: Locator;

    if (options?.byRole) {
      locator = this.getByRole(options.byRole, { name: selector as string });
    } else if (options?.byLabel) {
      locator = this.getByLabel(selector as string);
    } else if (selector instanceof Locator) {
      locator = selector;
    } else {
      locator = this.context.locator(selector as string);
    }
    await locator.click();
  }

  @LogExecution
  async fill(
    selector: string | Locator,
    value: string,
    options?: { byRole?: string; byLabel?: string; byPlaceholder?: string }
  ): Promise<void> {
    let locator: Locator;

    if (options?.byRole) {
      locator = this.getByRole(options.byRole, { name: selector as string });
    } else if (options?.byLabel) {
      locator = this.getByLabel(selector as string);
    } else if (options?.byPlaceholder) {
      locator = this.getByPlaceholder(selector as string);
    } else if (selector instanceof Locator) {
      locator = selector;
    } else {
      locator = this.context.locator(selector as string);
    }

    await locator.fill(value);
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
