import { BaseAssertions } from './base-assertions';

export class FormAssertions extends BaseAssertions {
  async assertFormSubmitted(formSelector: string) {
    await this.expectToHaveClass(formSelector, 'ng-submitted');
  }

  async assertFormValid(formSelector: string) {
    await this.expectToHaveClass(formSelector, 'ng-valid');
  }

  async assertFormInvalid(formSelector: string) {
    await this.expectToHaveClass(formSelector, 'ng-invalid');
  }

  async assertInputValue(inputSelector: string, expectedValue: string) {
    await this.expectToHaveValue(inputSelector, expectedValue);
  }

  async assertErrorMessage(errorSelector: string, expectedMessage: string) {
    await this.expectToBeVisible(errorSelector);
    await this.expectToHaveText(errorSelector, expectedMessage);
  }
}
