import { expect } from '@playwright/test';
import { BaseAssertions } from './base-assertions';

export class ToastrAssertions extends BaseAssertions {
  async expectToastToBeVisible() {
    await this.expectToBeVisible('nb-toast');
  }

  async expectToastToBeHidden() {
    await this.expectToBeHidden('nb-toast');
  }
  async checkToastMessage(title: string, content: string) {
    const toastrContainer = this.page.locator('nb-toast.content-container');
    const toastTitle = toastrContainer.filter({ hasText: title });
    const toastContent = toastrContainer.filter({ hasText: content });

    await expect(toastTitle).toBeVisible();
    await expect(toastContent).toBeVisible();
  }

  async expectToastTitle(expectedTitle: string) {
    const title = this.page.locator('.title');
    await expect(title).toContainText(expectedTitle);
  }

  async expectToastContent(expectedContent: string) {
    const contentElement = this.page.locator('.message');
    await expect(contentElement).toContainText(expectedContent);
  }
}