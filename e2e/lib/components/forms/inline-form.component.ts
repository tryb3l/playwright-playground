import { Page } from '@playwright/test';
import { FormComponent } from '@components/forms/base/base.form.component';

class InlineFormComponent extends FormComponent {
  constructor(page: Page) {
    super(page, "nb-card:has-text('Inline form')");
  }

  async fillName(name: string) {
    await this.fillInputByRole('textbox', 'Jane Doe', name);
  }

  async fillEmail(email: string) {
    await this.fillInputByRole('textbox', 'Email', email);
  }

  async checkRememberMe() {
    await this.checkCheckboxByRole('checkbox', 'Remember me');
  }

  async submit() {
    await this.clickButton('Submit');
  }
}

export { InlineFormComponent };
