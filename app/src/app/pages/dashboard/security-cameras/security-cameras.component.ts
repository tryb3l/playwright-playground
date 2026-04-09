import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppThemeService } from '../../../@theme/services/app-theme.service';

import { Camera, SecurityCamerasData } from '../../../@core/data/security-cameras';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html',
  standalone: false
})
export class SecurityCamerasComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  cameras: Camera[];
  selectedCamera: Camera;
  isSingleView = false;
  actionSize: 'small' | 'medium' = 'medium';

  constructor(
    private themeService: AppThemeService,
    private securityCamerasService: SecurityCamerasData,
  ) { }

  ngOnInit() {
    this.securityCamerasService.getCamerasData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cameras: Camera[]) => {
        this.cameras = cameras;
        this.selectedCamera = this.cameras[0];
      });

    const breakpoints = this.themeService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, breakpoint]) => breakpoint.width),
        takeUntil(this.destroy$),
      )
      .subscribe((width: number) => {
        this.actionSize = width > breakpoints.md ? 'medium' : 'small';
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }
}
