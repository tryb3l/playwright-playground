import { Page, Request, Response } from '@playwright/test';

type NetworkErrorEntry = {
  type: 'requestfailed' | 'response';
  url: string;
  method?: string;
  status?: number;
  statusText?: string;
  failure?: string;
  timestamp: number;
};

type NetworkTrackerOptions = {
  maxErrors?: number;
  ignorePatterns?: string[];
  statusCodesToIgnore?: number[];
  trackResponses?: boolean;
  trackRequestFailures?: boolean;
};

class NetworkErrorsTracker {
  private errors: NetworkErrorEntry[] = [];
  private readonly maxErrors: number;
  private readonly ignorePatterns: readonly string[];
  private readonly statusCodesToIgnore: readonly number[];
  private readonly trackResponses: boolean;
  private readonly trackRequestFailures: boolean;

  private requestFailedHandler: ((request: Request) => void) | null = null;
  private responseHandler: ((response: Response) => void) | null = null;
  private started = false;

  constructor(
    private readonly page: Page,
    options?: NetworkTrackerOptions
  ) {
    this.maxErrors = options?.maxErrors ?? 50;
    this.ignorePatterns = options?.ignorePatterns ?? [];
    this.statusCodesToIgnore = options?.statusCodesToIgnore ?? [];
    this.trackResponses = options?.trackResponses ?? true;
    this.trackRequestFailures = options?.trackRequestFailures ?? true;
  }

  startTracking() {
    if (this.started) return;
    this.started = true;

    if (this.trackRequestFailures) {
      this.requestFailedHandler = (request: Request) => {
        const url = request.url();
        if (this.shouldIgnore(url)) return;

        const failure = request.failure()?.errorText || 'Unknown failure';
        this.push({
          type: 'requestfailed',
          url,
          method: request.method(),
          failure,
          timestamp: Date.now(),
        });
      };

      this.page.on('requestfailed', this.requestFailedHandler);
    }

    if (this.trackResponses) {
      this.responseHandler = (response: Response) => {
        const status = response.status();
        if (status < 400) return;

        const url = response.url();
        if (this.shouldIgnore(url)) return;
        if (this.statusCodesToIgnore.includes(status)) return;

        this.push({
          type: 'response',
          url,
          status,
          statusText: response.statusText(),
          timestamp: Date.now(),
        });
      };

      this.page.on('response', this.responseHandler);
    }
  }

  stopTracking() {
    if (!this.started) return;
    this.started = false;

    if (this.requestFailedHandler) {
      this.page.off('requestfailed', this.requestFailedHandler);
      this.requestFailedHandler = null;
    }

    if (this.responseHandler) {
      this.page.off('response', this.responseHandler);
      this.responseHandler = null;
    }
  }

  getErrors(): readonly NetworkErrorEntry[] {
    return this.errors;
  }

  getErrorsAsText(): string {
    return this.errors
      .map((e) => {
        const statusInfo =
          e.status !== undefined ? ` ${e.status} ${e.statusText || ''}` : '';
        const methodInfo = e.method ? ` ${e.method}` : '';
        const failureInfo = e.failure ? ` | ${e.failure}` : '';
        return `[${new Date(e.timestamp).toISOString()}] ${e.type}${methodInfo} ${e.url}${statusInfo}${failureInfo}`;
      })
      .join('\n\n');
  }

  clearErrors() {
    this.errors = [];
  }

  private shouldIgnore(url: string): boolean {
    return this.ignorePatterns.some((pattern) => url.includes(pattern));
  }

  private push(entry: NetworkErrorEntry) {
    this.errors.push(entry);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
  }
}

export { NetworkErrorsTracker };
export type { NetworkErrorEntry, NetworkTrackerOptions };
