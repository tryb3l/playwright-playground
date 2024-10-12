import { Page } from '@playwright/test';
import { HelperBase } from '@utils/helper-base';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';

class FormLayoutsPage extends HelperBase {
  private inlineForm: InlineFormComponent;
  private gridForm: GridFormComponent;

  constructor(page: Page) {
    super(page);
    this.inlineForm = new InlineFormComponent(page);
    this.gridForm = new GridFormComponent(page);
  }

  async submitInlineFormWithOptions(
    name: string,
    email: string,
    rememberMe: boolean
  ) {
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
    await this.gridForm.fillEmail(email);
    await this.gridForm.fillPassword(password);
    await this.gridForm.selectOption(optionText);
    await this.gridForm.submit();
  }
}

export { FormLayoutsPage };
