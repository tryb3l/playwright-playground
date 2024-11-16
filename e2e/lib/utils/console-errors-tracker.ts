import { Page } from '@playwright/test';

class ConsoleErrorsTracker {
  private errors: string[] = [];
  private ignorePatterns: string[];

  constructor(private page: Page, ignorePatterns: string[] = []) {
    this.ignorePatterns = ignorePatterns;
  }

  startTracking() {
    this.page.on('console', (message) => {
      if (message.type() === 'error') {
        const text = message.text();

        // Check if the error should be ignored
        const shouldIgnore = this.ignorePatterns.some((pattern) =>
          text.includes(pattern)
        );

        if (!shouldIgnore) {
          this.errors.push(text);
        }
      }
    });
  }

  getErrors() {
    return this.errors;
  }

  stopTracking() {
    this.page.off('console', () => {});
  }
}

export { ConsoleErrorsTracker };