import { Component } from '@angular/core';

@Component({
  selector: 'ngx-three-columns-layout',
  styleUrls: ['./three-columns.layout.scss'],
  template: `
    <mat-sidenav-container class="column-layout">
      <mat-sidenav mode="side" opened class="menu-sidebar">
        <ng-content select="mat-nav-list"></ng-content>
      </mat-sidenav>
      <mat-sidenav-content>
        <ngx-header></ngx-header>
        <div class="content column-container">
          <div class="small-column"></div>
          <div class="main-column">
            <ng-content select="router-outlet"></ng-content>
          </div>
          <div class="small-column"></div>
        </div>
        <ngx-footer></ngx-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  standalone: false,
})
export class ThreeColumnsLayoutComponent {}
