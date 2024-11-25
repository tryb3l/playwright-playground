import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export class CheckboxComponent extends BaseComponent {
  protected checkboxLocator: Locator;

  constructor(page: Page, checkboxSelector: string) {
    super(page);
    this.checkboxLocator = page.locator(checkboxSelector);
    this.context = this.checkboxLocator;
  }

  async checkByRole(role: 'checkbox', name: string) {
    const checkbox = this.getByRole(role, { name });
    await checkbox.check({ force: true });
  }

  async checkByLabel(label: string) {
    const checkbox = this.getByLabel(label);
    await checkbox.check({ force: true });
  }

  async uncheckByRole(role: 'checkbox', name: string) {
    const checkbox = this.getByRole(role, { name });
    await checkbox.uncheck({ force: true });
  }

  async uncheckByLabel(label: string) {
    const checkbox = this.getByLabel(label);
    await checkbox.uncheck({ force: true });
  }

  async isChecked(selector: string): Promise<boolean> {
    const checkbox = this.context.locator(selector);
    return await checkbox.isChecked();
  }
}
