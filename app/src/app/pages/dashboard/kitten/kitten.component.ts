import { Component, OnDestroy } from '@angular/core';
import { AppThemeService } from '../../../@theme/services/app-theme.service';

@Component({
  selector: 'ngx-kitten',
  styleUrls: ['./kitten.component.scss'],
  templateUrl: './kitten.component.html',
  standalone: false
})
export class KittenComponent implements OnDestroy {

  currentTheme: string;
  themeSubscription: any;

  constructor(private themeService: AppThemeService) {
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.themeSubscription?.unsubscribe();
  }
}
