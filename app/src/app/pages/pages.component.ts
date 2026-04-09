import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout [menu]="menu">
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
  standalone: false
})
export class PagesComponent {

  menu = MENU_ITEMS;
}
