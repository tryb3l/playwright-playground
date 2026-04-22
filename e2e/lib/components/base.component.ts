import { Locator, Page } from '@playwright/test';
import { Logger } from '@utils/logger';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createTextMatcher(text: string, exact?: boolean): RegExp {
  const escapedText = escapeRegExp(text);
  return exact
    ? new RegExp(`^\\s*${escapedText}\\s*$`)
    : new RegExp(escapedText);
}

type ElementLookupOptions = {
  byRole?: Parameters<Page['getByRole']>[0];
  byLabel?: Parameters<Page['getByLabel']>[0];
  byPlaceholder?: Parameters<Page['getByPlaceholder']>[0];
  byTestId?: Parameters<Page['getByTestId']>[0];
  byText?: Parameters<Page['getByText']>[0];
  name?: string | RegExp;
  exact?: boolean;
};

type ClickOptions = ElementLookupOptions & {
  text?: string;
  useFirst?: boolean;
};

export abstract class BaseComponent {
  protected page: Page;
  protected logger: Logger;
  protected context: Page | Locator;

  constructor(target: Page | Locator, componentName?: string) {
    if (BaseComponent.isLocator(target)) {
      this.page = target.page();
      this.context = target;
    } else {
      this.page = target;
      this.context = target;
    }
    this.logger = new Logger(componentName || this.constructor.name);
  }

  private static isLocator(target: Page | Locator): target is Locator {
    return (
      typeof target !== 'undefined' &&
      typeof (target as Locator).page === 'function'
    );
  }

  protected getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1]
  ): Locator {
    this.logger.debug('getByRole', { role, options });
    return this.context.getByRole(role, options);
  }

  protected getByLabel(
    label: Parameters<Page['getByLabel']>[0],
    options?: Parameters<Page['getByLabel']>[1]
  ): Locator {
    this.logger.debug('getByLabel', { label, options });
    return this.context.getByLabel(label, options);
  }

  protected getByPlaceholder(
    placeholder: Parameters<Page['getByPlaceholder']>[0],
    options?: Parameters<Page['getByPlaceholder']>[1]
  ): Locator {
    this.logger.debug('getByPlaceholder', { placeholder, options });
    return this.context.getByPlaceholder(placeholder, options);
  }

  protected getByTestId(testId: Parameters<Page['getByTestId']>[0]): Locator {
    this.logger.debug('getByTestId', { testId });
    return this.context.getByTestId(testId);
  }

  protected getByText(
    text: Parameters<Page['getByText']>[0],
    options?: Parameters<Page['getByText']>[1]
  ): Locator {
    this.logger.debug('getByText', { text, options });
    return this.context.getByText(text, options);
  }

  private getElement(
    selector: string | Locator,
    options?: ElementLookupOptions
  ): Locator {
    if (options?.byRole) {
      const roleOptions: Parameters<Page['getByRole']>[1] = {};

      if (options.name !== undefined) {
        roleOptions.name = options.name;
      } else if (typeof selector === 'string' && selector.length > 0) {
        roleOptions.name = selector;
      }

      if (options.exact !== undefined) {
        roleOptions.exact = options.exact;
      }

      return this.context.getByRole(options.byRole, roleOptions);
    } else if (options?.byLabel) {
      return this.context.getByLabel(options.byLabel, {
        exact: options.exact,
      });
    } else if (options?.byPlaceholder) {
      return this.context.getByPlaceholder(options.byPlaceholder, {
        exact: options.exact,
      });
    } else if (options?.byTestId) {
      return this.context.getByTestId(options.byTestId);
    } else if (options?.byText) {
      return this.context.getByText(options.byText, {
        exact: options.exact,
      });
    } else if (typeof selector === 'string') {
      return this.context.locator(selector);
    } else {
      return selector;
    }
  }

  async click(
    selector: string | Locator,
    options?: ClickOptions
  ): Promise<void> {
    let element = this.getElement(selector, options);

    if (options?.text) {
      element = element.filter({
        hasText: createTextMatcher(options.text, options.exact),
      });
    }

    if (options?.useFirst === true) {
      await element.first().click();
    } else {
      await element.click();
    }
  }

  async fill(
    selector: string | Locator,
    value: string,
    options?: ElementLookupOptions
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
