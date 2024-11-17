import { FormLayoutsPage } from '@pages/form-layouts.page';
import { DatePickerPage } from '@pages/date-picker.page';
import { StartPage } from '@fixtures/start-page.enum';

export const startPageClassMap = {
  [StartPage.FormLayouts]: FormLayoutsPage,
  [StartPage.DatePicker]: DatePickerPage,
  //TODO: add more mappings
};

export type StartPageClassMap = typeof startPageClassMap;

export { StartPage };
