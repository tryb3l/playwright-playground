import '@playwright/test';

declare module '@playwright/test' {
  interface PlaywrightTestOptions {
    /**
     * Indicates whether the test should run as an authenticated (logged-in) user.
     * @default false
     */
    authenticated?: boolean;
    /**
     * An array of console error messages to ignore during test execution.
     */
    ignoreConsoleErrors?: string[];
    /**
     * An array of network error URL fragments to ignore.
     */
    ignoreNetworkErrors?: string[];
    /**
     * Enable or disable network error tracking per test.
     * @default true
     */
    trackNetworkErrors?: boolean;
    /**
     * HTTP status codes to ignore (e.g. 404s in negative tests).
     */
    statusCodesToIgnore?: number[];
    /**
     * Enable strict network tracking (no default ignore patterns).
     * @default false
     */
    strictNetwork?: boolean;
  }
}
declare module '@components/*' {
  const content: any;
  export = content;
}

declare module '@utils/*' {
  const content: any;
  export = content;
}

declare module '@fixtures/*' {
  const content: any;
  export = content;
}

declare module '@factories/*' {
  const content: any;
  export = content;
}
