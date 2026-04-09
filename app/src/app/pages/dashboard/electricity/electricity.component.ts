import { Component, OnDestroy } from '@angular/core';
import { AppThemeService } from '../../../@theme/services/app-theme.service';

import { Electricity, ElectricityChart, ElectricityData } from '../../../@core/data/electricity';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-electricity',
  styleUrls: ['./electricity.component.scss'],
  templateUrl: './electricity.component.html',
  standalone: false
})
export class ElectricityComponent implements OnDestroy {

  private alive = true;

  listData: Electricity[];
  chartData: ElectricityChart[];
  selectedYearTitle: string | null = null;

  type = 'week';
  types = ['week', 'month', 'year'];

  currentTheme: string;
  themeSubscription: any;

  constructor(private electricityService: ElectricityData,
    private themeService: AppThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    forkJoin(
      this.electricityService.getListData(),
      this.electricityService.getChartData(),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([listData, chartData]: [Electricity[], ElectricityChart[]]) => {
        this.listData = listData;
        this.chartData = chartData;
        this.selectedYearTitle = listData.find((item) => item.active)?.title ?? listData[0]?.title ?? null;
      });
  }

  get activeYear(): Electricity | undefined {
    return this.listData?.find((item) => item.title === this.selectedYearTitle) ?? this.listData?.[0];
  }

  setActiveYear(title: string): void {
    this.selectedYearTitle = title;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
