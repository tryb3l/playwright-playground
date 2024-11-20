import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { LogExecution } from '@utils/decorators';

export class ButtonComponent extends BaseComponent {
  protected buttonLocator: Locator;

  constructor(page: Page, buttonSelector: string) {
    super(page);
    this.buttonLocator = page.locator(buttonSelector);
    this.context = this.buttonLocator;
  }

  @LogExecution
  async clickButtonByRole(role: 'button', name: string) {
    await this.click(name, { byRole: role });
  }

  @LogExecution
  async clickButtonByLabel(label: string) {
    await this.click(label, { byLabel: label });
  }

  @LogExecution
  async clickButtonByText(text: string) {
    await this.click(text);
  }

  @LogExecution
  async clickButton(buttonName: string) {
    await this.context.click(buttonName);
  }
}
