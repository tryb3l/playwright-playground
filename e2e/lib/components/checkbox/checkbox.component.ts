import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { LogExecution } from '@utils/decorators';

export class CheckboxComponent extends BaseComponent {
  protected checkboxLocator: Locator;

  constructor(page: Page, checkboxSelector: string) {
    super(page);
    this.checkboxLocator = page.locator(checkboxSelector);
    this.context = this.checkboxLocator;
  }

  @LogExecution
  async checkByRole(role: 'checkbox', name: string) {
    const checkbox = this.getByRole(role, { name });
    await checkbox.check({ force: true });
  }

  @LogExecution
  async checkByLabel(label: string) {
    const checkbox = this.getByLabel(label);
    await checkbox.check({ force: true });
  }

  @LogExecution
  async uncheckByRole(role: 'checkbox', name: string) {
    const checkbox = this.getByRole(role, { name });
    await checkbox.uncheck({ force: true });
  }

  @LogExecution
  async uncheckByLabel(label: string) {
    const checkbox = this.getByLabel(label);
    await checkbox.uncheck({ force: true });
  }

  @LogExecution
  async isChecked(selector: string): Promise<boolean> {
    const checkbox = this.context.locator(selector);
    return await checkbox.isChecked();
  }
}
