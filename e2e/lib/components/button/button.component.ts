import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export class ButtonComponent extends BaseComponent {
  protected buttonLocator: Locator;

  constructor(page: Page, buttonSelector: string) {
    super(page);
    this.buttonLocator = page.locator(buttonSelector);
  }

  async clickButtonByRole(role: 'button', name: string) {
    await this.click(this.buttonLocator, { byRole: role, name: name });
  }

  async clickButtonByLabel(label: string) {
    await this.click(this.buttonLocator, { byLabel: label });
  }

  async clickButtonByText(text: string) {
    await this.click(this.buttonLocator, { text: text });
  }

  async clickButton(buttonName: string) {
    await this.click(this.buttonLocator);
  }
}