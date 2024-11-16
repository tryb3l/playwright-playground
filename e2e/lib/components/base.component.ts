import { Locator, Page } from '@playwright/test';
import { Logger } from '@utils/logger';

export abstract class BaseComponent {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page, componentName?: string) {
    this.page = page;
    this.logger = new Logger(componentName || this.constructor.name);
  }

  // Common methods for all components
  async fillInputByLabel(label: string, value: string, locator?: Locator) {
    const context = locator || this.page;
    await context.getByLabel(label).fill(value);
  }

  async fillInputByRole(
    role: 'textbox',
    name: string,
    value: string,
    locator?: Locator
  ) {
    const context = locator || this.page;
    await context.getByRole(role, { name }).fill(value);
  }

  async fillInputByPlaceholder(
    placeholder: string,
    value: string,
    locator?: Locator
  ) {
    const context = locator || this.page;
    await context.getByPlaceholder(placeholder).fill(value);
  }

  async clickButtonByRoleName(buttonName: string, locator?: Locator) {
    const context = locator || this.page;
    await context.getByRole('button', { name: buttonName }).click();
  }

  async clickByText(text: string, locator?: Locator) {
    const context = locator || this.page;
    await context.click(`text=${text}`);
  }

  async checkCheckboxByLabel(label: string, locator?: Locator) {
    const context = locator || this.page;
    await context.getByLabel(label).check({ force: true });
  }

  async checkCheckboxByRole(role: 'checkbox', name: string, locator?: Locator) {
    const context = locator || this.page;
    await context.getByRole(role, { name }).check({ force: true });
  }

  async getText(selector: string, locator?: Locator): Promise<string> {
    const context = locator || this.page;
    const text = await context.textContent(selector);
    if (text === null) {
      throw new Error(`No text content found for selector: ${selector}`);
    }
    return text;
  }
}
