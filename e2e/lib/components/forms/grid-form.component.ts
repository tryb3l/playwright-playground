import { Page } from '@playwright/test';
import { FormComponent } from '@components/forms/base/base.form.component';
import { Logger } from '@utils/logger';

class GridFormComponent extends FormComponent {
  private logger: Logger;

  constructor(page: Page) {
    super(page, "nb-card:has-text('Using the Grid')");
    this.logger = new Logger('GridFormComponent');
  }

  async fillEmail(email: string) {
    this.logger.info(`Filling email field`, { email });
    await this.fillInputByLabel('Email', email);
  }

  async fillPassword(password: string) {
    this.logger.info(`Filling password field`, { password });
    await this.fillInputByLabel('Password', password);
  }

  async selectOption(optionText: string) {
    this.logger.info(`Selecting option`, { optionText });
    await this.formLocator
      .getByRole('radio', { name: optionText })
      .check({ force: true });
  }

  async submit() {
    this.logger.info(`Submitting form`);
    await this.clickButton('Submit');
  }
}

export { GridFormComponent };
