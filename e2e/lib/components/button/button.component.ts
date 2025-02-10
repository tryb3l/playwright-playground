import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export class ButtonComponent extends BaseComponent {
  protected buttonLocator: Locator;

  constructor(page: Page, buttonSelector: string) {
    super(page);
    this.buttonLocator = page.locator(buttonSelector);
    this.context = this.buttonLocator;
  }

  async clickButtonByRole(role: 'button', name: string) {
    await this.click(name, { byRole: role });
  }

  async clickButtonByLabel(label: string) {
    await this.click(label, { byLabel: label });
  }

  async clickButtonByText(text: string) {
    await this.click(text, { text: text });
  }

  async clickButton(buttonName: string) {
    await this.click(buttonName);
  }
}
