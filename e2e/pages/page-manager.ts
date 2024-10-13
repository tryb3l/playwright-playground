import { Page } from '@playwright/test';
import { NavigationComponent } from '@components/navbar/navigation.component';

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

  getPage<T>(pageClass: new (page: Page) => T): T {
    return new pageClass(this.page);
  }
}

export { PageManager };
