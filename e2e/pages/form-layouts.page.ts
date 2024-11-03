import { Page } from '@playwright/test';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';
import { ActionLogger } from '@utils/action.logger.decorator';
import { ErrorHandler } from '@utils/error-handler.decorator';

class FormLayoutsPage {
  constructor(
    page: Page,
    private inlineForm: InlineFormComponent = new InlineFormComponent(page),
    private gridForm: GridFormComponent = new GridFormComponent(page)
  ) {}

  @ActionLogger('Submit Inline Form', 'info')
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

  @ActionLogger('Submit Grid Form', 'info')
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
