import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { LogExecution } from '@utils/decorators';

export abstract class FormComponent extends BaseComponent {
  protected formLocator: Locator;

  constructor(page: Page, formSelector: string) {
    super(page);
    this.formLocator = page.locator(formSelector);
    this.context = this.formLocator;
  }

  @LogExecution
  async fillInputByRole(role: 'textbox', name: string, value: string) {
    await this.context.getByRole(role, { name }).fill(value);
  }

  @LogExecution
  async fillInputByLabel(label: string, value: string) {
    await this.context.getByLabel(label).fill(value);
  }

  @LogExecution
  async fillInputByPlaceholder(placeholder: string, value: string) {
    await this.context.getByPlaceholder(placeholder).fill(value);
  }

  @LogExecution
  async clickButton(buttonName: string) {
    await this.context.getByRole('button', { name: buttonName }).click();
  }

  @LogExecution
  async checkCheckboxByLabel(label: string) {
    await this.context.getByLabel(label).check({ force: true });
  }

  @LogExecution
  async checkCheckboxByRole(role: 'checkbox', name: string) {
    await this.context.getByRole(role, { name }).check({ force: true });
  }
}
