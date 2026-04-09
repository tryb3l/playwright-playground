import { Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

class NavigationComponent extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async navigateToSection(sectionPath: string) {
    const menuItems = sectionPath.split(' > ');

    for (const menuItemName of menuItems) {
      const menuItem = this.page.getByTestId(this.getMenuTestId(menuItemName));

      //Check if the menu item is expandable
      const isExpandable =
        (await menuItem.getAttribute('aria-expanded')) !== null;

      if (isExpandable) {
        const expanded = await menuItem.getAttribute('aria-expanded');
        if (expanded === 'false') {
          await menuItem.click();
        }
      } else {
        await menuItem.click();
      }
    }
  }

  private getMenuTestId(menuItemName: string): string {
    return `nav-item-${menuItemName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`;
  }
}

export { NavigationComponent };
