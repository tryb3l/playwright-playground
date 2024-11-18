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
    this.logger.info(`Filling input by label`, { label, value });
    this.logger.debug(
      `Filling input by label '${label}' with value '${value}'`
    );
    const context = locator || this.page;
    await context.getByLabel(label).fill(value);
  }

  async fillInputByRole(
    role: 'textbox',
    name: string,
    value: string,
    locator?: Locator
  ) {
    this.logger.info(`Filling input by role '${role}'`, { role, name, value });
    this.logger.debug(
      `Filling input by role '${role}' with name '${name}' with value '${value}'`
    );
    const context = locator || this.page;
    await context.getByRole(role, { name }).fill(value);
  }

  async fillInputByPlaceholder(
    placeholder: string,
    value: string,
    locator?: Locator
  ) {
    this.logger.info(`Filling input by placeholder`, { placeholder, value });
    this.logger.debug(
      `Filling input by placeholder '${placeholder}' with value '${value}'`
    );
    const context = locator || this.page;
    await context.getByPlaceholder(placeholder).fill(value);
  }

  async clickButtonByRoleName(buttonName: string, locator?: Locator) {
    this.logger.info(`Clicking button by role and name, '${buttonName}'`);
    this.logger.debug(
      `Clicking button by role 'button' with name '${buttonName}'`
    );
    const context = locator || this.page;
    await context.getByRole('button', { name: buttonName }).click();
  }

  async clickByText(text: string, locator?: Locator) {
    this.logger.info(`Clicking element by text`, { text });
    this.logger.debug(`Clicking element by text '${text}'`);
    const context = locator || this.page;
    await context.click(`text=${text}`);
  }

  async checkCheckboxByLabel(label: string, locator?: Locator) {
    this.logger.info(`Checking checkbox by label, '${label}'`);
    this.logger.debug(`Checking checkbox by label '${label}' with force true`);
    const context = locator || this.page;
    await context.getByLabel(label).check({ force: true });
  }

  async checkCheckboxByRole(role: 'checkbox', name: string, locator?: Locator) {
    this.logger.info(`Checking checkbox by role, '${role}'`);
    this.logger.debug(
      `Checking checkbox by role '${role}' with name '${name}' with force true`
    );
    const context = locator || this.page;
    await context.getByRole(role, { name }).check({ force: true });
  }

  async getText(selector: string, locator?: Locator): Promise<string> {
    this.logger.info(`Getting text content of element`, { selector });
    this.logger.debug(
      `Getting text content of element with selector '${selector}'`
    );
    const context = locator || this.page;
    const text = await context.textContent(selector);
    if (text === null) {
      throw new Error(`No text content found for selector: ${selector}`);
    }
    return text;
  }
}
