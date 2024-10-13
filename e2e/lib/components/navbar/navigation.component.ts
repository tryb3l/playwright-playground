import { Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';
import { StartPage } from '@fixtures/base-fixtures';

class NavigationComponent extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  private readonly menuActions: { [key in StartPage]: () => Promise<void> } = {
    [StartPage.IoTDashboard]: async () => {
      await this.page.goto('/');
    },
    [StartPage.FormLayouts]: async () => {
      await this.expandMenu('Forms');
      await this.clickByText('Form Layouts');
    },
    [StartPage.DatePicker]: async () => {
      await this.expandMenu('Forms');
      await this.clickByText('Datepicker');
    },
    [StartPage.Toastr]: async () => {
      await this.expandMenu('Modal & Overlays');
      await this.clickByText('Toastr');
    },
    [StartPage.SmartTable]: async () => {
      await this.expandMenu('Tables & Data');
      await this.clickByText('Smart Table');
    },
    //TODO add more pages
  };

  async navigateToSection(section: StartPage) {
    const action = this.menuActions[section];
    if (action) {
      await action();
    } else {
      throw new Error(`Unknown section: ${section}`);
    }
  }

  private async expandMenu(menuItemName: string) {
    const menuItem = this.page.getByTitle(menuItemName);
    const expanded = await menuItem.getAttribute('aria-expanded');

    if (expanded === 'false') {
      await menuItem.click();
    }
  }
}

export { NavigationComponent };
