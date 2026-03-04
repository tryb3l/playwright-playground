import { NgModule } from '@angular/core';
import { Angular2SmartTableModule as Ng2SmartTableModule } from 'angular2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { FsIconComponent } from './tree-grid/tree-grid.component';

@NgModule({
  imports: [ThemeModule, TablesRoutingModule, Ng2SmartTableModule],
  declarations: [...routedComponents, FsIconComponent],
})
export class TablesModule {}
