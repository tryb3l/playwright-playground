import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export abstract class FormComponent extends BaseComponent {
  protected formLocator: Locator;

  constructor(page: Page, formSelector: string) {
    super(page);
    this.formLocator = page.locator(formSelector);
    this.context = this.formLocator;
  }

  async fillInputByRole(role: 'textbox', name: string, value: string) {
    await this.fill(name, value, { byRole: role });
  }

  async fillInputByLabel(label: string, value: string) {
    await this.fill(label, value, { byLabel: label });
  }

  async fillInputByPlaceholder(placeholder: string, value: string) {
    await this.fill(placeholder, value, { byPlaceholder: placeholder });
  }

  async clickButton(buttonName: string) {
    await this.click(buttonName, { byRole: 'button', name: buttonName });
  }

  async checkCheckboxByLabel(label: string) {
    await this.check(label, { byLabel: label });
  }

  async checkCheckboxByRole(role: 'checkbox', name: string) {
    await this.check(name, { byRole: role, name });
  }

  async selectRadioButton(name: string) {
    await this.check(name, { byRole: 'radio', name });
  }
}
