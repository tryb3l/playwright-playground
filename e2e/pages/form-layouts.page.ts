import { Page } from '@playwright/test';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';
import { Logger } from '@utils/logger';

class FormLayoutsPage {
  private logger: Logger;
  private inlineForm: InlineFormComponent;
  private gridForm: GridFormComponent;

  constructor(
    page: Page,
    inlineForm?: InlineFormComponent,
    gridForm?: GridFormComponent
  ) {
    this.logger = new Logger('FormLayoutsPage');
    this.inlineForm = inlineForm || new InlineFormComponent(page);
    this.gridForm = gridForm || new GridFormComponent(page);
  }

  async submitInlineFormWithOptions(
    name: string,
    email: string,
    rememberMe: boolean
  ) {
    this.logger.info('Submitting inline form with options', {
      name,
      email,
      rememberMe,
    });
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
    this.logger.info('Submitting grid form with credentials', {
      email,
      password,
      optionText,
    });
    await this.gridForm.fillEmail(email);
    await this.gridForm.fillPassword(password);
    await this.gridForm.selectOption(optionText);
    await this.gridForm.submit();
  }
}

export { FormLayoutsPage };
