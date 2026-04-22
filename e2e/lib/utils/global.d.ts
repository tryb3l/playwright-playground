import '@playwright/test';

declare module '@playwright/test' {
  interface PlaywrightTestOptions {
    /**
     * Indicates whether the test should run as an authenticated (logged-in) user.
     * @default false
     */
    authenticated?: boolean;
    /**
     * Console error substrings filtered before report attachment and failure policy checks.
     */
    ignoreConsoleErrors?: string[];
    /**
     * Network URL substrings filtered before report attachment and failure policy checks.
     */
    ignoreNetworkErrors?: string[];
    /**
     * Track page request failures and HTTP >= 400 responses for reporting and optional hard-fail checks.
     * @default true
     */
    trackNetworkErrors?: boolean;
    /**
     * Fail an otherwise passing test when unexpected console errors are captured.
     * @default true
     */
    failOnConsoleErrors?: boolean;
    /**
     * Fail an otherwise passing test when unexpected network errors are captured.
     * @default false
     */
    failOnNetworkErrors?: boolean;
    /**
     * HTTP status codes filtered before report attachment and failure policy checks.
     */
    statusCodesToIgnore?: number[];
    /**
     * When true, disable the default network ignore list and use only per-test ignore patterns.
     * @default false
     */
    strictNetwork?: boolean;
  }
}
