import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export class RadioButtonComponent extends BaseComponent {
  protected radioButtonLocator: Locator;

  constructor(root: Page | Locator, selector: string) {
    super(root);
    this.radioButtonLocator = root.locator(selector);
  }

  private getRadioButton(options?: {
    byRole?: Parameters<Page['getByRole']>[0];
    name?: string;
  }): Locator {
    if (options?.byRole) {
      return this.context.getByRole(options.byRole, { name: options.name });
    }
    return this.radioButtonLocator;
  }

  async selectByRole(role: 'radio', name: string) {
    await this.getRadioButton({ byRole: role, name: name }).check({
      force: true,
    });
  }
}
