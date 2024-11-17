import { Page } from '@playwright/test';
import { FormComponent } from '@components/forms/base/base.form.component';
import { Logger } from '@utils/logger';

class InlineFormComponent extends FormComponent {
  private logger: Logger;

  constructor(page: Page) {
    super(page, "nb-card:has-text('Inline form')");
    this.logger = new Logger('InlineFormComponent');
  }

  async fillName(name: string) {
    this.logger.info(`Filling name field`, { name });
    await this.fillInputByRole('textbox', 'Jane Doe', name);
  }

  async fillEmail(email: string) {
    this.logger.info(`Filling email field`, { email });
    await this.fillInputByRole('textbox', 'Email', email);
  }

  async checkRememberMe() {
    this.logger.info(`Checking remember me checkbox`);
    await this.checkCheckboxByRole('checkbox', 'Remember me');
  }

  async submit() {
    this.logger.info(`Submitting form`);
    await this.clickButton('Submit');
  }
}

export { InlineFormComponent };
