import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export abstract class FormComponent extends BaseComponent {
  protected formLocator: Locator;

  constructor(page: Page, formSelector: string) {
    super(page);
    this.formLocator = page.locator(formSelector);
  }

  async fillInputByRole(role: 'textbox', name: string, value: string) {
    await super.fillInputByRole(role, name, value, this.formLocator);
  }

  async fillInputByLabel(label: string, value: string) {
    await super.fillInputByLabel(label, value, this.formLocator);
  }

  async fillInputByPlaceholder(placeholder: string, value: string) {
    await super.fillInputByPlaceholder(placeholder, value, this.formLocator);
  }

  async clickButton(buttonName: string) {
    await super.clickButtonByRoleName(buttonName, this.formLocator);
  }

  async checkCheckboxByLabel(label: string) {
    await super.checkCheckboxByLabel(label, this.formLocator);
  }

  async checkCheckboxByRole(role: 'checkbox', name: string) {
    await super.checkCheckboxByRole(role, name, this.formLocator);
  }

  async getText(selector: string): Promise<string> {
    return await super.getText(selector, this.formLocator);
  }
}
