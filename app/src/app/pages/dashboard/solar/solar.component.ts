import { delay } from 'rxjs/operators';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { ThemeService } from '../../../@core/utils';

@Component({
  selector: 'ngx-solar',
  styleUrls: ['./solar.component.scss'],
  template: `
    <mat-card size="tiny" class="solar-card">
      <mat-card-header>Solar Energy Consumption</mat-card-header>
      <mat-card-content>
        <div echarts [options]="option" class="echart"></div>
        <div class="info">
          <div class="h4 value">6.421 kWh</div>
          <div class="details subtitle-2"><span>out of</span> 8.421 kWh</div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  standalone: false,
})
export class SolarComponent implements AfterViewInit, OnDestroy {
  private value = 0;

  @Input()
  set chartValue(value: number) {
    this.value = value;

    if (this.option.series) {
      this.option.series[0].data[0].value = value;
      this.option.series[0].data[1].value = 100 - value;
      this.option.series[1].data[0].value = value;
    }
  }

  option: any = {};
  themeSubscription: any;

  constructor(private theme: ThemeService) {}

  ngAfterViewInit() {
    this.themeSubscription = this.theme
      .getJsTheme()
      .pipe(delay(1))
      .subscribe((config) => {
        const solarTheme: any = config.variables.solar;

        this.option = Object.assign(
          {},
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            series: [
              {
                name: ' ',
                clockwise: true,
                emphasis: { scale: false },
                type: 'pie',
                center: ['45%', '50%'],
                radius: solarTheme.radius,
                data: [
                  {
                    value: this.value,
                    name: ' ',
                    label: {
                      position: 'center',
                      formatter: '{d}%',
                      fontSize: '22',
                      fontFamily: config.variables.fontSecondary,
                      fontWeight: '600',
                      color: config.variables.fgHeading,
                    },
                    tooltip: {
                      show: false,
                    },
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 3,
                    },
                  },
                  {
                    value: 100 - this.value,
                    name: ' ',
                    tooltip: {
                      show: false,
                    },
                    label: {
                      position: 'inner',
                    },
                    itemStyle: {
                      color: solarTheme.secondSeriesFill,
                    },
                  },
                ],
              },
              {
                name: ' ',
                clockwise: true,
                emphasis: { scale: false },
                type: 'pie',
                center: ['45%', '50%'],
                radius: solarTheme.radius,
                data: [
                  {
                    value: this.value,
                    name: ' ',
                    label: {
                      position: 'inner',
                      show: false,
                    },
                    tooltip: {
                      show: false,
                    },
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 7,
                    },
                  },
                  {
                    value: 28,
                    name: ' ',
                    tooltip: {
                      show: false,
                    },
                    label: {
                      position: 'inner',
                    },
                    itemStyle: {
                      color: 'none',
                    },
                  },
                ],
              },
            ],
          }
        );
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
