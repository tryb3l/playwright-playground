import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { ButtonComponent } from '@components/button/button.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';

export abstract class FormComponent extends BaseComponent {
  protected formLocator: Locator;
  protected buttonComponent: ButtonComponent;
  protected checkboxComponent: CheckboxComponent;

  constructor(page: Page, formSelector: string) {
    super(page);
    this.formLocator = page.locator(formSelector);
    this.context = this.formLocator;
    this.buttonComponent = new ButtonComponent(page, formSelector);
    this.checkboxComponent = new CheckboxComponent(page, formSelector);
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
    await this.buttonComponent.clickButtonByRole('button', buttonName);
  }

  async checkCheckboxByLabel(label: string) {
    await this.checkboxComponent.checkByLabel(label);
  }

  async checkCheckboxByRole(role: 'checkbox', name: string) {
    await this.context.getByRole(role, { name }).check({ force: true });
  }
}
