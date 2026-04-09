import { expect, test as base } from '@fixtures/base-fixtures';
import { PageManager } from '@pages/page-manager';
import { startPageClassMap, StartPageKeys } from '@fixtures/page-mapping';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import { NetworkErrorsTracker } from '@utils/network-errors-tracker';
import { AssertionsFactory } from '@utils/assertions/assertion-factory';

type PageObjectOf<T extends StartPageKeys> = InstanceType<
  (typeof startPageClassMap)[T]
>;

interface CustomFixtures<T extends StartPageKeys> {
  pageManager: PageManager;
  pageObject: PageObjectOf<T>;
  consoleErrorsTracker: ConsoleErrorsTracker;
  networkErrorsTracker: NetworkErrorsTracker;
  assertions: AssertionsFactory;
  startPageReady: void;
}

function createTestForStartPage<T extends StartPageKeys>(startPage: T) {
  return base.extend<CustomFixtures<T>>({
    pageManager: async ({ page }, use) => {
      const pageManager = new PageManager(page);
      await use(pageManager);
    },
    startPageReady: [
      async ({ pageManager }, use) => {
        await pageManager.navigateTo(startPage);
        await use();
      },
      { auto: true },
    ],
    pageObject: async ({ pageManager }, use) => {
      const PageClass = startPageClassMap[startPage];
      const pageObject = new PageClass(pageManager.getPageInstance());
      await use(pageObject as PageObjectOf<T>);
    },
    assertions: async ({ page }, use) => {
      const assertions = new AssertionsFactory(page);
      await use(assertions);
    },
  });
}

export { createTestForStartPage };
export { expect };
