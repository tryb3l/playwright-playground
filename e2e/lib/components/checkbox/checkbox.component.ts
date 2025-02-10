import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export class CheckboxComponent extends BaseComponent {
  protected checkboxLocator: Locator;

  constructor(page: Page, checkboxSelector: string) {
    super(page);
    this.checkboxLocator = page.locator(checkboxSelector);
  }

  private getCheckbox(
    options?: {
      byRole?: Parameters<Page['getByRole']>[0];
      byLabel?: Parameters<Page['getByLabel']>[0];
      name?: string
    }
  ): Locator {
    if (options?.byRole) {
      return this.context.getByRole(options.byRole, { name: options.name });
    } else if (options?.byLabel) {
      return this.context.getByLabel(options.byLabel);
    }
    return this.checkboxLocator
  }

  async checkByRole(role: 'checkbox', name: string) {
    await this.getCheckbox({ byRole: role, name: name }).check({ force: true })
  }

  async checkByLabel(label: string) {
    await this.getCheckbox({ byLabel: label }).check({ force: true })
  }

  async uncheckByRole(role: 'checkbox', name: string) {
    await this.getCheckbox({ byRole: role, name: name }).uncheck({ force: true })
  }

  async uncheckByLabel(label: string) {
    await this.getCheckbox({ byLabel: label }).uncheck({ force: true })
  }

  async isChecked(): Promise<boolean> {
    return await this.checkboxLocator.isChecked();
  }
}