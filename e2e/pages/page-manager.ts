import { Page } from '@playwright/test';
import { NavigationComponent } from '@components/navbar/navigation.component';
import { StartPage } from '@fixtures/start-page.enum';

const defaultBaseUrl = process.env.BASE_URL || 'http://localhost:4200';
const appReadinessUrl = new URL('/', defaultBaseUrl).toString();
const appStartupTimeoutMs = Number(process.env.APP_STARTUP_TIMEOUT_MS || 180000);
const appPollIntervalMs = 250;

function isConnectionRefusedError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    /(ERR_CONNECTION_REFUSED|NS_ERROR_CONNECTION_REFUSED)/.test(error.message)
  );
}

async function waitForAppToBeReachable(): Promise<void> {
  const deadline = Date.now() + appStartupTimeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(appReadinessUrl, {
        method: 'GET',
        redirect: 'manual',
      });

      if (response.status < 500) {
        return;
      }

      lastError = new Error(
        `Received HTTP ${response.status} from ${appReadinessUrl}`
      );
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, appPollIntervalMs));
  }

  if (lastError instanceof Error) {
    throw new Error(
      `Timed out waiting ${appStartupTimeoutMs}ms for ${appReadinessUrl}. ${lastError.message}`
    );
  }

  throw new Error(
    `Timed out waiting ${appStartupTimeoutMs}ms for ${appReadinessUrl}.`
  );
}

class PageManager {
  private readonly page: Page;
  private readonly navigation: NavigationComponent;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
  }

  getNavigation() {
    return this.navigation;
  }

  getPage<T extends object>(PageClass: new (page: Page) => T): T {
    return new PageClass(this.page);
  }

  public getPageInstance(): Page {
    return this.page;
  }

  async navigateTo(startPage: StartPage) {
    try {
      await waitForAppToBeReachable();
      await this.page.goto('/');
    } catch (error) {
      if (
        isConnectionRefusedError(error) ||
        (error instanceof Error &&
          error.message.includes('Timed out waiting') &&
          error.message.includes(appReadinessUrl))
      ) {
        throw new Error(
          `Unable to reach the app at ${defaultBaseUrl}. Run the test through the root Playwright config so the configured webServer starts the Angular app, or start the app manually before running the suite.\n\n${error.message}`
        );
      }

      throw error;
    }

    await this.getNavigation().navigateToSection(startPage);
  }
}

export { PageManager };
