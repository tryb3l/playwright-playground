import { Page, Locator } from '@playwright/test';
import { FormComponent } from '@components/forms/base/base.form.component';
import { Logger } from '@utils/logger';

class InlineFormComponent extends FormComponent {
  private logger: Logger;

  constructor(page: Page) {
    super(page, "nb-card:has-text('Inline form')");
    this.logger = new Logger('InlineFormComponent');
  }

  async fillName(name: string) {
    this.logger.info('Filling name field', { field: 'Name', value: name });
    this.logger.debug(
      `Filling input by role 'textbox' with name 'Name' and value '${name}'`
    );
    await this.fillInputByRole('textbox', 'Jane Doe', name);
  }

  async fillEmail(email: string) {
    this.logger.info('Filling email field', { field: 'Email', value: email });
    this.logger.debug(
      `Filling input by role 'textbox' with name 'Email' and value '${email}'`
    );
    await this.fillInputByRole('textbox', 'Email', email);
  }

  async checkRememberMe() {
    this.logger.info('Checking "Remember me" checkbox', {
      field: 'Remember me',
    });
    this.logger.debug(
      `Checking checkbox by role 'checkbox' with label 'Remember me'`
    );
    await this.checkCheckboxByRole('checkbox', 'Remember me');
  }

  async submit() {
    this.logger.info('Submitting inline form');
    this.logger.debug(`Clicking button by role 'button' with name 'Submit'`);
    await this.clickButton('Submit');
  }
}

export { InlineFormComponent };
