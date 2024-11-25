import { Page } from '@playwright/test';
import { FormComponent } from '@components/forms/base/base.form.component';

class InlineFormComponent extends FormComponent {
  constructor(page: Page) {
    super(page, 'nb-card.inline-form-card');
  }

  async fillName(name: string) {
    await this.fillInputByPlaceholder('Jane Doe', name);
  }

  async fillEmail(email: string) {
    await this.fillInputByPlaceholder('Email', email);
  }

  async checkRememberMe() {
    await this.checkCheckboxByLabel('Remember me');
  }

  async submit() {
    await this.clickButton('Submit');
  }
}

export { InlineFormComponent };
