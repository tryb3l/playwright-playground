import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ThemeService, NbComponentSize } from '../../../@core/utils';

import {
  Camera,
  SecurityCamerasData,
} from '../../../@core/data/security-cameras';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html',
  standalone: false,
})
export class SecurityCamerasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cameras: Camera[];
  selectedCamera: Camera;
  isSingleView = false;
  actionSize: NbComponentSize = 'medium';

  constructor(
    private themeService: ThemeService,
    private securityCamerasService: SecurityCamerasData
  ) {}

  ngOnInit() {
    this.securityCamerasService
      .getCamerasData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cameras: Camera[]) => {
        if (cameras && cameras.length > 0) {
          this.cameras = cameras;
          this.selectedCamera = this.cameras[0];
        }
      });

    this.themeService
      .onMediaQueryChange()
      .pipe(
        takeUntil(this.destroy$),
        map(([, breakpoint]) => breakpoint.width)
      )
      .subscribe((width: number) => {
        this.actionSize = width > 768 ? 'medium' : 'small';
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
