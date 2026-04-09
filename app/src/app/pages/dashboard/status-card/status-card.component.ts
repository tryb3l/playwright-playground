import { Component, Input } from '@angular/core';

@Component({
    selector: 'ngx-status-card',
    styleUrls: ['./status-card.component.scss'],
    template: `
    <button
      type="button"
      class="status-card"
      (click)="on = !on"
      [ngClass]="['status-' + type, on ? 'is-on' : 'off']"
      [attr.data-testid]="getTestId()"
      [attr.aria-pressed]="on"
    >
      <div class="icon-container">
        <div class="icon">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title h5">{{ title }}</div>
        <div class="status paragraph-2">{{ on ? 'ON' : 'OFF' }}</div>
      </div>
    </button>
  `,
    standalone: false
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() on = true;

  getTestId(): string {
    return `dashboard-status-card-${this.title.toLowerCase().replace(/\s+/g, '-')}`;
  }
}
