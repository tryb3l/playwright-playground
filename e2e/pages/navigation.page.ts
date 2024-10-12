import { Page } from '@playwright/test';
import { HelperBase } from '@utils/helper-base';

class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async formLayoutPage() {
    await this.selectGroupMenuItem('Forms');
    await this.page.getByText('Form Layouts').click();
  }

  async datepickerPage() {
    await this.selectGroupMenuItem('Forms');
    await this.page.getByText('Datepicker').click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem('Modal & Overlays');
    await this.page.getByText('Toastr').click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem('Tables & Data');
    await this.page.getByText('Smart Table').click();
  }

  async iotDashboardPage() {
    await this.page.goto('IoT Dashboard');
  }

  private async selectGroupMenuItem(menuItemName: string) {
    const menuItem = this.page.getByTitle(menuItemName);
    const expanded = await menuItem.getAttribute('aria-expanded');

    if (expanded === 'false') {
      await menuItem.click();
    }
  }
}

export { NavigationPage };
