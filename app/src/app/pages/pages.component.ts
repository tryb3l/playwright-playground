import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <mat-nav-list>
        @for (item of menu; track item.title) {
          @if (item.group) {
            <h3 mat-subheader>{{ item.title }}</h3>
          } @else if (item.children) {
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  @if (item.icon) {
                    <mat-icon>{{ item.icon }}</mat-icon>
                  }
                  {{ item.title }}
                </mat-panel-title>
              </mat-expansion-panel-header>
              <mat-nav-list>
                @for (child of item.children; track child.title) {
                  <a mat-list-item [routerLink]="child.link">{{
                    child.title
                  }}</a>
                }
              </mat-nav-list>
            </mat-expansion-panel>
          } @else {
            <a mat-list-item [routerLink]="item.link">
              @if (item.icon) {
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              }
              <span matListItemTitle>{{ item.title }}</span>
            </a>
          }
        }
      </mat-nav-list>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
  standalone: false,
})
export class PagesComponent {
  menu = MENU_ITEMS;
}
