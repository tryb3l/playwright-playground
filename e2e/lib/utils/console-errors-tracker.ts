import { Page, ConsoleMessage } from '@playwright/test';

type ConsoleErrorEntry = {
  type: 'console' | 'pageerror';
  text: string;
  url?: string;
  stack?: string;
  timestamp: number;
};

class ConsoleErrorsTracker {
  private errors: ConsoleErrorEntry[] = [];
  private readonly ignorePatterns: readonly string[];
  private readonly maxErrors: number;

  private consoleHandler: ((message: ConsoleMessage) => void) | null = null;
  private pageErrorHandler: ((error: Error) => void) | null = null;
  private started = false;

  constructor(
    private readonly page: Page,
    ignorePatterns: string[] = [],
    options?: { maxErrors?: number }
  ) {
    this.ignorePatterns = ignorePatterns;
    this.maxErrors = options?.maxErrors ?? 50;
  }

  startTracking() {
    if (this.started) return;
    this.started = true;

    this.consoleHandler = (message: ConsoleMessage) => {
      if (message.type() !== 'error') return;

      const text = message.text();
      if (this.shouldIgnore(text)) return;

      this.push({
        type: 'console',
        text,
        url: message.location().url || undefined,
        timestamp: Date.now(),
      });
    };

    this.pageErrorHandler = (error: Error) => {
      const text = error.message || String(error);
      if (this.shouldIgnore(text)) return;

      this.push({
        type: 'pageerror',
        text,
        stack: error.stack,
        timestamp: Date.now(),
      });
    };

    this.page.on('console', this.consoleHandler);
    this.page.on('pageerror', this.pageErrorHandler);
  }

  stopTracking() {
    if (!this.started) return;
    this.started = false;

    if (this.consoleHandler) {
      this.page.off('console', this.consoleHandler);
      this.consoleHandler = null;
    }
    if (this.pageErrorHandler) {
      this.page.off('pageerror', this.pageErrorHandler);
      this.pageErrorHandler = null;
    }
  }

  getErrors(): readonly ConsoleErrorEntry[] {
    return this.errors;
  }

  getErrorsAsText(): string {
    return this.errors
      .map((e) => {
        const where = e.url ? ` (${e.url})` : '';
        const stack = e.stack ? `\n${e.stack}` : '';
        return `[${new Date(e.timestamp).toISOString()}] ${e.type}: ${e.text}${where}${stack}`;
      })
      .join('\n\n');
  }

  clearErrors() {
    this.errors = [];
  }

  private shouldIgnore(text: string): boolean {
    return this.ignorePatterns.some((pattern) => text.includes(pattern));
  }

  private push(entry: ConsoleErrorEntry) {
    this.errors.push(entry);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
  }
}

export { ConsoleErrorsTracker };
export type { ConsoleErrorEntry };
