import { Component, HostBinding, OnDestroy } from '@angular/core';
import { AppMediaBreakpoint, AppThemeService } from '../../../@theme/services/app-theme.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-rooms',
  styleUrls: ['./rooms.component.scss'],
  template: `
    <section class="rooms-card" data-testid="dashboard-rooms-card">
      @if (!isCollapsed()) {
        <button
          type="button"
          class="collapse"
          data-testid="dashboard-rooms-collapse-button"
          (click)="collapse()"
          aria-label="Collapse room details"
        >
          <span class="fa-solid fa-chevron-down" aria-hidden="true"></span>
        </button>
      }

      <ngx-room-selector
        class="rooms-selector-pane"
        data-testid="dashboard-rooms-selector-pane"
        [class.dark-background]="isDarkTheme"
        (selectEvent)="select($event)"
      ></ngx-room-selector>

      <ngx-player
        class="rooms-player-pane"
        data-testid="dashboard-rooms-player-pane"
        [collapsed]="isCollapsed() && breakpoint.width <= breakpoints.md"
      ></ngx-player>
    </section>
  `,
  standalone: false
})
export class RoomsComponent implements OnDestroy {

  @HostBinding('class.expanded')
  expanded: boolean;
  private selected: number;

  isDarkTheme: boolean;

  breakpoint: AppMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  themeChangeSubscription: any;

  constructor(private themeService: AppThemeService) {

    this.breakpoint = this.themeService.getCurrentBreakpoint();
    this.breakpoints = this.themeService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([, newValue]) => {
        this.breakpoint = newValue;
      });

    this.themeChangeSubscription = this.themeService.onThemeChange()
      .pipe(map(({ name }) => name === 'cosmic' || name === 'dark'))
      .subscribe((isDark: boolean) => this.isDarkTheme = isDark);
  }

  select(roomNumber) {
    if (this.isSelected(roomNumber)) {
      this.expand();
    } else {
      this.collapse();
    }

    this.selected = roomNumber;
  }

  expand() {
    this.expanded = true;
  }

  collapse() {
    this.expanded = false;
  }

  isCollapsed() {
    return !this.expanded;
  }

  private isSelected(roomNumber): boolean {
    return this.selected === roomNumber;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    this.themeChangeSubscription.unsubscribe();
  }
}
