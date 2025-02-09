import { FormLayoutsPage } from '@pages/form-layouts.page';
import { DatePickerPage } from '@pages/date-picker.page';
import { ToastrPage } from '@pages/toastr.page';
import { StartPage } from '@fixtures/start-page.enum';

export const startPageClassMap = {
  [StartPage.FormLayouts]: FormLayoutsPage,
  [StartPage.DatePicker]: DatePickerPage,
  [StartPage.Toastr]: ToastrPage,
  //TODO: add more mappings
};

export type StartPageClassMap = typeof startPageClassMap;
export type StartPageKeys = keyof StartPageClassMap;
export { StartPage };
