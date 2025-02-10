// forms/base/base.form.component.ts
import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { ButtonComponent } from '@components/button/button.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { RadioButtonComponent } from "@components/radio-button/radio-button.component"; // Import

export abstract class FormComponent extends BaseComponent {
  protected formLocator: Locator;
  private _buttonComponent: ButtonComponent | undefined;
  private _checkboxComponent: CheckboxComponent | undefined;
  private _radioButtonComponent: RadioButtonComponent | undefined;

  constructor(page: Page, formSelector: string) {
    super(page);
    this.formLocator = page.locator(formSelector);
    this.context = this.formLocator; // Set form as context
  }

  protected get buttonComponent(): ButtonComponent {
    if (!this._buttonComponent) {
      this._buttonComponent = new ButtonComponent(this.context as Page, 'button'); // Use context and type assertion
    }
    return this._buttonComponent;
  }

  protected get checkboxComponent(): CheckboxComponent {
    if (!this._checkboxComponent) {
      this._checkboxComponent = new CheckboxComponent(this.context as Page, 'nb-checkbox')// Use context and type assertion
    }
    return this._checkboxComponent
  }

  protected get radioButtonComponent(): RadioButtonComponent {
    if (!this._radioButtonComponent) {
      this._radioButtonComponent = new RadioButtonComponent(this.context as Page, 'input[type="radio"]');
    }
    return this._radioButtonComponent;
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
    await this.checkboxComponent.checkByRole(role, name)
  }

  async selectRadioButton(name: string) {
    await this.radioButtonComponent.selectByRole('radio', name)
  }
}