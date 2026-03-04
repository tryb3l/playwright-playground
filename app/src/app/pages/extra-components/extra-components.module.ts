import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ExtraComponentsRoutingModule } from './extra-components-routing.module';

// components
import { ExtraComponentsComponent } from './extra-components.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DayCellComponent } from './calendar/day-cell/day-cell.component';
import { NebularFormInputsComponent } from './form-inputs/nebular-form-inputs.component';
import { NebularSelectComponent } from './form-inputs/nebular-select/nebular-select.component';

const COMPONENTS = [
  ExtraComponentsComponent,
  CalendarComponent,
  DayCellComponent,
  NebularFormInputsComponent,
  NebularSelectComponent,
];

const MODULES = [ThemeModule, ExtraComponentsRoutingModule];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
})
export class ExtraComponentsModule {}
