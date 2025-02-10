import { Locator, Page } from '@playwright/test';
import { Logger } from '@utils/logger';

export abstract class BaseComponent {
  protected page: Page;
  protected logger: Logger;
  protected context: Page | Locator;

  constructor(page: Page, componentName?: string) {
    this.page = page;
    this.context = page;
    this.logger = new Logger(componentName || this.constructor.name);
  }

  protected getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1]
  ): Locator {
    this.logger.info('getByRole', { role, options });
    return this.context.getByRole(role, options);
  }

  protected getByLabel(
    label: Parameters<Page['getByLabel']>[0],
    options?: Parameters<Page['getByLabel']>[1]
  ): Locator {
    this.logger.info('getByLabel', { label, options });
    return this.context.getByLabel(label, options);
  }

  protected getByPlaceholder(
    placeholder: Parameters<Page['getByPlaceholder']>[0],
    options?: Parameters<Page['getByPlaceholder']>[1]
  ): Locator {
    this.logger.info('getByPlaceholder', { placeholder, options });
    return this.context.getByPlaceholder(placeholder, options);
  }

  protected getByTestId(testId: Parameters<Page['getByTestId']>[0]): Locator {
    this.logger.info('getByTestId', { testId });
    return this.context.getByTestId(testId);
  }

  protected getByText(
    text: Parameters<Page['getByText']>[0],
    options?: Parameters<Page['getByText']>[1]
  ): Locator {
    this.logger.info('getByText', { text, options });
    return this.context.getByText(text, options);
  }

  private getElement(
    selector: string | Locator,
    options?: {
      byRole?: Parameters<Page['getByRole']>[0];
      byLabel?: Parameters<Page['getByLabel']>[0];
      byPlaceholder?: Parameters<Page['getByPlaceholder']>[0];
      byTestId?: Parameters<Page['getByTestId']>[0];
      byText?: Parameters<Page['getByText']>[0];
    }
  ): Locator {
    if (options?.byRole) {
      return this.context.getByRole(options.byRole);
    } else if (options?.byLabel) {
      return this.context.getByLabel(options.byLabel);
    } else if (options?.byPlaceholder) {
      return this.context.getByPlaceholder(options.byPlaceholder);
    } else if (options?.byTestId) {
      return this.context.getByTestId(options.byTestId);
    } else if (options?.byText) {
      return this.context.getByText(options.byText);
    } else if (typeof selector === 'string') {
      return this.context.locator(selector);
    } else {
      return selector;
    }
  }

  async click(
    selector: string | Locator,
    options?: {
      byRole?: Parameters<Page['getByRole']>[0];
      byLabel?: Parameters<Page['getByLabel']>[0];
      byTestId?: Parameters<Page['getByTestId']>[0];
      text?: Parameters<Page['getByText']>[0];
      name?: string;
      exact?: boolean;
    }
  ): Promise<void> {
    let element = this.getElement(selector, options);

    if (options?.text) {
      element = element.filter({
        hasText: options.exact ? options.text : new RegExp(options.text),
      });
    }

    await element.click();
  }

  async fill(
    selector: string | Locator,
    value: string,
    options?: {
      byRole?: Parameters<Page['getByRole']>[0];
      byLabel?: Parameters<Page['getByLabel']>[0];
      byPlaceholder?: Parameters<Page['getByPlaceholder']>[0];
      byTestId?: Parameters<Page['getByTestId']>[0];
      byText?: Parameters<Page['getByText']>[0];
      name?: string;
    }
  ): Promise<void> {
    const element = this.getElement(selector, options);
    await element.fill(value);
  }

  async getText(selector: string | Locator): Promise<string> {
    const element = this.getElement(selector);
    const text = await element.textContent();
    if (text === null) {
      throw new Error(`No text content found for selector: ${selector}`);
    }
    return text;
  }

  async isVisible(selector: string | Locator): Promise<boolean> {
    const element = this.getElement(selector);
    return await element.isVisible();
  }
}
