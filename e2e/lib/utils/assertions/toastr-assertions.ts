import { expect } from '@playwright/test';
import { BaseAssertions } from './base-assertions';

export class ToastrAssertions extends BaseAssertions {
  async expectToastToBeVisible() {
    await this.expectToBeVisible('[data-testid="app-toast"]');
  }

  async expectToastToBeHidden() {
    await this.expectToBeHidden('[data-testid="app-toast"]');
  }
  async checkToastMessage(title: string, content: string) {
    const toastTitle = this.page.getByTestId('app-toast-title').filter({
      hasText: title,
    });
    const toastContent = this.page.getByTestId('app-toast-content').filter({
      hasText: content,
    });

    await expect(toastTitle).toBeVisible();
    await expect(toastContent).toBeVisible();
  }

  async expectToastTitle(expectedTitle: string) {
    const title = this.page.getByTestId('app-toast-title');
    await expect(title).toContainText(expectedTitle);
  }

  async expectToastContent(expectedContent: string) {
    const contentElement = this.page.getByTestId('app-toast-content');
    await expect(contentElement).toContainText(expectedContent);
  }
}
