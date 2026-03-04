import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { UserData } from '../../../@core/data/users';
import {
  LayoutService,
  ThemeService,
  SidebarService,
} from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private themeService: ThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick));

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
      .pipe(
        map((result) => result.matches),
        takeUntil(this.destroy$)
      )
      .subscribe((isMobile) => (this.userPictureOnly = isMobile));

    this.themeService
      .onThemeChange()
      .pipe(
        takeUntil(this.destroy$),
        map(({ name }) => name)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle();
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.router.navigate(['/pages/iot-dashboard']);
    return false;
  }

  goToProfile() {
    this.router.navigate(['/pages/iot-dashboard']);
    return false;
  }

  logout() {
    this.router.navigate(['/auth/login']);
    return false;
  }
}
