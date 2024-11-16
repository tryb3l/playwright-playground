import { Page } from '@playwright/test';
import { NavigationComponent } from '@components/navbar/navigation.component';
import { StartPage } from '@fixtures/start-page.enum';

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
    await this.page.goto('/');
    await this.getNavigation().navigateToSection(startPage);
  }
}

export { PageManager };
