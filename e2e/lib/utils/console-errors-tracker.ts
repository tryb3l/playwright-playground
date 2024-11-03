import { Page, ConsoleMessage, TestInfo } from '@playwright/test';

export class ConsoleErrorsTracker {
  private errors: string[] = [];

  constructor(
    private page: Page,
    private testInfo: TestInfo,
    private ignoreConsoleErrors: string[] = []
  ) {}

  startTracking() {
    this.page.on('console', this.onConsoleMessage);
  }

  stopTracking() {
    this.page.off('console', this.onConsoleMessage);
    this.reportErrors();
  }

  private onConsoleMessage = (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const shouldIgnore = this.ignoreConsoleErrors.some((ignoredMessage) =>
        text.includes(ignoredMessage)
      );
      if (!shouldIgnore) {
        this.errors.push(text);
      }
    }
  };

  private async reportErrors() {
    if (this.errors.length > 0) {
      await this.testInfo.attach('Console Errors', {
        body: this.errors.join('\n'),
        contentType: 'text/plain',
      });
      this.testInfo.status = 'failed';
      this.testInfo.error = new Error(
        `Console errors detected:\n${this.errors.join('\n')}`
      );
    }
  }
}
