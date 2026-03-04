/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }

  ngAfterViewInit(): void {
    const spinner = document.getElementById('nb-global-spinner');
    if (spinner) {
      spinner.remove();
    }
  }
}
