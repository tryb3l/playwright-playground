import { Page } from "@playwright/test";

class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout * 1000);
  }
}

export { HelperBase };
