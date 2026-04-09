import { Component, OnDestroy } from '@angular/core';
import { AppThemeService } from '../../../@theme/services/app-theme.service';
import { takeWhile } from 'rxjs/operators';

import { TrafficChartData } from '../../../@core/data/traffic-chart';

@Component({
  selector: 'ngx-traffic',
  styleUrls: ['./traffic.component.scss'],
  template: `
    <section class="traffic-card" data-testid="dashboard-traffic-card">
      <header class="traffic-card__header">
        <span>Traffic Consumption</span>

        <label class="traffic-select">
          <span class="sr-only">Traffic period</span>
          <select [(ngModel)]="type" data-testid="dashboard-traffic-period-select">
            @for (t of types; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </label>
      </header>

      <div class="traffic-chart-surface" data-testid="dashboard-traffic-chart-surface">
        <ngx-traffic-chart [points]="trafficChartPoints"></ngx-traffic-chart>
      </div>
    </section>
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
    private themeService: AppThemeService,
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
