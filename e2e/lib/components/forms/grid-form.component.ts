import { Page } from '@playwright/test';
import { FormComponent } from '@components/forms/form.component';

class GridFormComponent extends FormComponent {
  constructor(page: Page) {
    super(page, "nb-card:has-text('Using the Grid')");
  }

  async fillEmail(email: string) {
    await this.fillInputByLabel('Email', email);
  }

  async fillPassword(password: string) {
    await this.fillInputByLabel('Password', password);
  }

  async selectOption(optionText: string) {
    await this.formLocator
      .getByRole('radio', { name: optionText })
      .check({ force: true });
  }

  async submit() {
    await this.clickButton('Submit');
  }
}

export { GridFormComponent };