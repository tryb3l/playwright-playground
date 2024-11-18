import { test as base, expect } from '@fixtures/base-fixtures';
import { PageManager } from '@pages/page-manager';
import { startPageClassMap, StartPageKeys } from '@fixtures/page-mapping';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';

type PageObjectOf<T extends StartPageKeys> = InstanceType<
  (typeof startPageClassMap)[T]
>;

interface CustomFixtures<T extends StartPageKeys> {
  pageManager: PageManager;
  pageObject: PageObjectOf<T>;
  consoleErrorsTracker: ConsoleErrorsTracker;
  ignoreConsoleErrors: [[], { option: true }];
}

function createTestForStartPage<T extends StartPageKeys>(startPage: T) {
  const test = base.extend<CustomFixtures<T>>({
    pageManager: async ({ page }, use) => {
      const pageManager = new PageManager(page);
      await use(pageManager);
    },
    pageObject: async ({ pageManager }, use) => {
      await pageManager.navigateTo(startPage);
      const PageClass = startPageClassMap[startPage];
      const pageObject = new PageClass(pageManager.getPageInstance());
      await use(pageObject as PageObjectOf<T>);
    },
  });

  return test;
}

export { createTestForStartPage };
export { expect } from '@playwright/test';
