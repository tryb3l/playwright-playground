import { Page } from '@playwright/test';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';
import { Logger } from '@utils/logger';

class FormLayoutsPage {
  private logger: Logger;

  constructor(
    page: Page,
    private inlineForm: InlineFormComponent = new InlineFormComponent(page),
    private gridForm: GridFormComponent = new GridFormComponent(page)
  ) {
    this.logger = new Logger('FormLayoutsPage');
  }

  async submitInlineFormWithOptions(
    name: string,
    email: string,
    rememberMe: boolean
  ) {
    this.logger.info(`Submitting inline form`, { name, email, rememberMe });
    await this.inlineForm.fillName(name);
    await this.inlineForm.fillEmail(email);
    if (rememberMe) {
      await this.inlineForm.checkRememberMe();
    }
    await this.inlineForm.submit();
  }

  async submitGridFormWithCredentials(
    email: string,
    password: string,
    optionText: string
  ) {
    this.logger.info(`Submitting inline form`, { name, email, rememberMe });
    await this.gridForm.fillEmail(email);
    await this.gridForm.fillPassword(password);
    await this.gridForm.selectOption(optionText);
    await this.gridForm.submit();
  }
}

export { FormLayoutsPage };
