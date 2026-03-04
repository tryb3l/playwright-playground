import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ThemeService, NbMediaBreakpoint } from '../../../@core/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-rooms',
  styleUrls: ['./rooms.component.scss'],
  template: `
    <mat-card>
      <mat-icon (click)="collapse()" class="collapse" [hidden]="isCollapsed()">
        expand_more
      </mat-icon>
      <ngx-room-selector
        [class.dark-background]="isDarkTheme"
        (selectEvent)="select($event)"
      ></ngx-room-selector>
      <ngx-player [collapsed]="isCollapsed()"></ngx-player>
    </mat-card>
  `,
  standalone: false,
})
export class RoomsComponent implements OnDestroy {
  @HostBinding('class.expanded')
  expanded: boolean;
  private selected: number;

  isDarkTheme: boolean;

  breakpoint: NbMediaBreakpoint;
  breakpoints: any = { sm: 576, md: 768, lg: 992, xl: 1200 };
  themeSubscription: any;
  themeChangeSubscription: any;

  constructor(private themeService: ThemeService) {
    this.breakpoint = { name: 'md', width: 768 };
    this.themeSubscription = this.themeService
      .onMediaQueryChange()
      .subscribe(([, newValue]) => {
        this.breakpoint = newValue;
      });

    this.themeChangeSubscription = this.themeService
      .onThemeChange()
      .pipe(map(({ name }) => name === 'cosmic' || name === 'dark'))
      .subscribe((isDark: boolean) => (this.isDarkTheme = isDark));
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
