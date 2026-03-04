import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { FormLayoutsComponent } from './form-layouts/form-layouts.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { FormsModule as ngFormsModule } from '@angular/forms';

@NgModule({
  imports: [ThemeModule, FormsRoutingModule, ngFormsModule],
  declarations: [FormsComponent, FormLayoutsComponent, DatepickerComponent],
})
export class FormsModule {}
