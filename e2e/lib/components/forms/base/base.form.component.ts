import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export abstract class FormComponent extends BaseComponent {
  protected formLocator: Locator;

  constructor(page: Page, formSelector: string) {
    super(page);
    this.formLocator = page.locator(formSelector);
  }

  async fillInputByRole(role: 'textbox', name: string, value: string) {
    this.logger.info(`Filling input by role`, { role, name, value });
    await super.fillInputByRole(role, name, value, this.formLocator);
  }

  async fillInputByLabel(label: string, value: string) {
    this.logger.info(`Filling input by label`, { label, value });
    await super.fillInputByLabel(label, value, this.formLocator);
  }

  async fillInputByPlaceholder(placeholder: string, value: string) {
    this.logger.info(`Filling input by placeholder`, { placeholder, value });
    await super.fillInputByPlaceholder(placeholder, value, this.formLocator);
  }

  async clickButton(buttonName: string) {
    this.logger.info(`Clicking button by role name`, { buttonName });
    await super.clickButtonByRoleName(buttonName, this.formLocator);
  }

  async checkCheckboxByLabel(label: string) {
    this.logger.info(`Checking checkbox by label`, { label });
    await super.checkCheckboxByLabel(label, this.formLocator);
  }

  async checkCheckboxByRole(role: 'checkbox', name: string) {
    this.logger.info(`Checking checkbox by role`, { role, name });
    await super.checkCheckboxByRole(role, name, this.formLocator);
  }

  async getText(selector: string): Promise<string> {
    this.logger.info(`Getting text from element`, { selector });
    return await super.getText(selector, this.formLocator);
  }
}
