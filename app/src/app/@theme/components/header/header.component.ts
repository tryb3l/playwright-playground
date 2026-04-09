import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { User, UserData } from '../../../@core/data/users';
import {
  AppThemeName,
  APP_THEME_OPTIONS,
  AppThemeService,
} from '../../services/app-theme.service';
import { AppShellService } from '../../services/app-shell.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  standalone: false
})
export class HeaderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly themes = APP_THEME_OPTIONS;

  userPictureOnly = false;
  user?: User;
  currentTheme: AppThemeName = 'default';

  constructor(
    private readonly router: Router,
    private readonly userService: UserData,
    private readonly appThemeService: AppThemeService,
    private readonly appShellService: AppShellService,
  ) { }

  ngOnInit(): void {
    this.currentTheme = this.appThemeService.currentTheme;
    this.updateResponsiveState();

    this.userService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        if (Array.isArray(users)) {
          this.user = users[0];
          return;
        }

        this.user = (users as unknown as Record<string, User>).nick;
      });

    this.appThemeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((themeName) => {
        this.currentTheme = themeName;
      });
  }

  @HostListener('window:resize')
  updateResponsiveState(): void {
    this.userPictureOnly = window.innerWidth < 1280;
  }

  changeTheme(themeName: AppThemeName): void {
    this.appThemeService.setTheme(themeName);
  }

  toggleSidebar(): void {
    this.appShellService.toggleSidebar();
  }

  navigateHome(): void {
    void this.router.navigate(['/pages/iot-dashboard']);
  }
}
