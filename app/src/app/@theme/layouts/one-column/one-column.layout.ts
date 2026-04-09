import {
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppShellService } from '../../services/app-shell.service';
import { AppMenuItem } from '../../../pages/pages-menu';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <div class="app-shell" [class.app-shell--collapsed]="!sidebarOpen">
      <header class="app-shell__header">
        <ngx-header></ngx-header>
      </header>

      <div class="app-shell__body">
        <aside class="app-shell__sidebar" [attr.aria-hidden]="!sidebarOpen">
          <nav class="app-nav" aria-label="Primary navigation">
            @for (item of menu; track item.title) {
              @if (item.group) {
                <div class="app-nav__group">{{ item.title }}</div>
              } @else if (item.children?.length) {
                <div class="app-nav__section">
                  <a
                    class="app-nav__link app-nav__link--parent"
                    href="#"
                    role="link"
                    [attr.data-testid]="getMenuTestId(item.title)"
                    [attr.aria-expanded]="isExpanded(item)"
                    (click)="toggleItem(item, $event)"
                  >
                    <span>{{ item.title }}</span>
                    <span
                      class="fa-solid"
                      [class.fa-chevron-down]="isExpanded(item)"
                      [class.fa-chevron-right]="!isExpanded(item)"
                      aria-hidden="true"
                    ></span>
                  </a>

                  @if (isExpanded(item)) {
                    <div class="app-nav__children">
                      @for (child of item.children; track child.title) {
                        @if (child.link) {
                          <a
                            class="app-nav__link app-nav__link--child"
                            [attr.data-testid]="getMenuTestId(child.title)"
                            [routerLink]="child.link"
                            routerLinkActive="app-nav__link--active"
                          >
                            {{ child.title }}
                          </a>
                        }
                      }
                    </div>
                  }
                </div>
              } @else if (item.link) {
                <a
                  class="app-nav__link"
                  [attr.data-testid]="getMenuTestId(item.title)"
                  [routerLink]="item.link"
                  routerLinkActive="app-nav__link--active"
                >
                  {{ item.title }}
                </a>
              }
            }
          </nav>
        </aside>

        <main class="app-shell__content">
          <ng-content></ng-content>
        </main>
      </div>

      <footer class="app-shell__footer">
        <ngx-footer></ngx-footer>
      </footer>
    </div>
  `,
  standalone: false
})
export class OneColumnLayoutComponent implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input() menu: AppMenuItem[] = [];

  sidebarOpen = true;
  private expandedItems = new Set<string>();

  constructor(private readonly appShellService: AppShellService) { }

  ngOnInit(): void {
    this.expandMenuGroups();
    this.appShellService.sidebarOpen$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isOpen) => {
        this.sidebarOpen = isOpen;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menu']) {
      this.expandMenuGroups();
    }
  }

  isExpanded(item: AppMenuItem): boolean {
    return this.expandedItems.has(item.title);
  }

  toggleItem(item: AppMenuItem, event: Event): void {
    event.preventDefault();

    if (!item.children?.length) {
      return;
    }

    if (this.isExpanded(item)) {
      this.expandedItems.delete(item.title);
      return;
    }

    this.expandedItems.add(item.title);
  }

  getMenuTestId(title: string): string {
    return `nav-item-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`;
  }

  private expandMenuGroups(): void {
    this.expandedItems = new Set(
      this.menu.filter((item) => item.children?.length).map((item) => item.title),
    );
  }
}
