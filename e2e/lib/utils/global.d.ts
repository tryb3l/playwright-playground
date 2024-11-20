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
