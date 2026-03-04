import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidebarService } from '../../../@core/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <mat-sidenav-container class="column-layout">
      <mat-sidenav #sidenav mode="side" opened class="menu-sidebar">
        <ng-content select="mat-nav-list"></ng-content>
      </mat-sidenav>
      <mat-sidenav-content>
        <ngx-header></ngx-header>
        <div class="content">
          <ng-content select="router-outlet"></ng-content>
        </div>
        <ngx-footer></ngx-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  standalone: false,
})
export class OneColumnLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;
  private destroy$ = new Subject<void>();

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.onToggle
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.sidenav.toggle();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
