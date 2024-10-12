import { BaseComponent } from '@components/base.component';

class NavigationComponent extends BaseComponent {
  private readonly menuActions: { [section: string]: () => Promise<void> } = {
    'IoT Dashboard': async () => {
      await this.page.goto('/');
    },
    'Form Layouts': async () => {
      await this.expandMenu('Forms');
      await this.page.click('text=Form Layouts');
    },
    'Date Picker': async () => {
      await this.expandMenu('Forms');
      await this.page.click('text=Datepicker');
    },
    'Smart Table': async () => {
      await this.expandMenu('Tables & Data');
      await this.page.click('text=Smart Table');
    },
    'Toastr': async () => {
      await this.expandMenu('Modals & Alerts');
      await this.page.click('text=Toastr');
    },
  };

  async navigateToSection(section: string) {
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

    expanded === 'false' ? await menuItem.click() : null;
  }
}

export { NavigationComponent };
