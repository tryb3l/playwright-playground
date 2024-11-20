import { Locator, expect } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export class BaseAssertions extends BaseComponent {
  async expectToBeVisible(selector: string | Locator): Promise<void> {
    const element =
      typeof selector === 'string' ? this.context.locator(selector) : selector;
    await expect(element).toBeVisible();
  }

  async expectToBeHidden(selector: string | Locator): Promise<void> {
    const element =
      typeof selector === 'string' ? this.context.locator(selector) : selector;
    await expect(element).toBeHidden();
  }

  async expectToHaveClass(
    selector: string | Locator,
    className: string
  ): Promise<void> {
    const element =
      typeof selector === 'string' ? this.context.locator(selector) : selector;
    await expect(element).toHaveClass(new RegExp(className));
  }

  async expectToHaveValue(
    selector: string | Locator,
    value: string
  ): Promise<void> {
    const element =
      typeof selector === 'string' ? this.context.locator(selector) : selector;
    await expect(element).toHaveValue(value);
  }

  async expectToHaveText(
    selector: string | Locator,
    text: string
  ): Promise<void> {
    const element =
      typeof selector === 'string' ? this.context.locator(selector) : selector;
    await expect(element).toHaveText(text);
  }

  async getElementState(selector: string | Locator) {
    const element =
      typeof selector === 'string' ? this.context.locator(selector) : selector;
    return {
      isVisible: await element.isVisible(),
      isEnabled: await element.isEnabled(),
      value: await element.inputValue(),
      text: await element.textContent(),
      classes: await element.getAttribute('class'),
    };
  }
}
