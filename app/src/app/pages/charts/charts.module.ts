import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NbCardModule } from '@nebular/theme';
import { EchartsBarAnimationComponent } from './echarts/echarts-bar-animation.component';
import { ThemeModule } from '../../@theme/theme.module';
import { ChartsRoutingModule, routedComponents } from './charts-routing.module';
import { EchartsLineComponent } from './echarts/echarts-line.component';
import { EchartsPieComponent } from './echarts/echarts-pie.component';
import { EchartsBarComponent } from './echarts/echarts-bar.component';
import { EchartsMultipleXaxisComponent } from './echarts/echarts-multiple-xaxis.component';
import { EchartsAreaStackComponent } from './echarts/echarts-area-stack.component';
import { EchartsRadarComponent } from './echarts/echarts-radar.component';

const components = [
  EchartsLineComponent,
  EchartsPieComponent,
  EchartsBarComponent,
  EchartsMultipleXaxisComponent,
  EchartsAreaStackComponent,
  EchartsRadarComponent,
  EchartsBarAnimationComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    ChartsRoutingModule,
    NgxChartsModule,
    NbCardModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  declarations: [
    ...routedComponents,
    ...components
  ]
})
export class ChartsModule {}