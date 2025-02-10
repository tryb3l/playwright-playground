import { Page } from '@playwright/test';
import { InlineFormComponent } from '@components/forms/inline-form.component';
import { GridFormComponent } from '@components/forms/grid-form.component';

class FormLayoutsPage {
  private _inlineForm: InlineFormComponent | undefined;
  private _gridForm: GridFormComponent | undefined;
  private page: Page

  constructor(page: Page) {
    this.page = page
  }
  private get inlineForm(): InlineFormComponent {
    if (!this._inlineForm) {
      this._inlineForm = new InlineFormComponent(this.page);
    }
    return this._inlineForm
  }
  private get gridForm(): GridFormComponent {
    if (!this._gridForm) {
      this._gridForm = new GridFormComponent(this.page)
    }
    return this._gridForm
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