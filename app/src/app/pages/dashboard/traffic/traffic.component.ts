import { Component, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../@core/utils';
import { takeWhile } from 'rxjs/operators';

import { TrafficChartData } from '../../../@core/data/traffic-chart';

@Component({
  selector: 'ngx-traffic',
  styleUrls: ['./traffic.component.scss'],
  template: `
    <mat-card size="tiny">
      <mat-card-header>
        <span>Traffic Consumption</span>

        <mat-select [(value)]="type">
          @for (t of types; track t) {
            <mat-option [value]="t">{{ t }}</mat-option>
          }
        </mat-select>
      </mat-card-header>

      <ngx-traffic-chart [points]="trafficChartPoints"></ngx-traffic-chart>
    </mat-card>
  `,
  standalone: false,
})
export class TrafficComponent implements OnDestroy {
  private alive = true;

  trafficChartPoints: number[];
  type = 'month';
  types = ['week', 'month', 'year'];
  currentTheme: string;

  constructor(
    private themeService: ThemeService,
    private trafficChartService: TrafficChartData
  ) {
    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.currentTheme = theme.name;
      });

    this.trafficChartService
      .getTrafficChartData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.trafficChartPoints = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
