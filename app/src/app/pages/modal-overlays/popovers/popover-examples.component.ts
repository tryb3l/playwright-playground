import { Component } from '@angular/core';

@Component({
  selector: 'ngx-popover-tabs',
  template: `
    <mat-tab-group animationDuration="0ms" class="popover-tab-group">
      <mat-tab label="What's up?">
        <div class="popover-pane">Such a wonderful day!</div>
      </mat-tab>
      <mat-tab label="Second Tab">
        <div class="popover-pane">Indeed!</div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
      .popover-tab-group {
        min-width: min(20rem, calc(100vw - 3rem));
      }

      .popover-pane {
        padding: 1rem;
        color: var(--app-text-muted);
      }
    `,
  ],
  standalone: false
})
export class NgxPopoverTabsComponent {
}

@Component({
  selector: 'ngx-popover-form',
  template: `
    <form class="popover-form">
      <mat-form-field appearance="outline" class="popover-form__field">
        <mat-label>Recipients</mat-label>
        <input matInput type="text" placeholder="Recipients" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="popover-form__field">
        <mat-label>Subject</mat-label>
        <input matInput type="text" placeholder="Subject" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="popover-form__field">
        <mat-label>Message</mat-label>
        <textarea matInput rows="4" placeholder="Message"></textarea>
      </mat-form-field>

      <button mat-flat-button type="button" color="primary">Send</button>
    </form>
  `,
  styles: [
    `
      .popover-form {
        display: grid;
        gap: 0.9rem;
        min-width: min(20rem, calc(100vw - 3rem));
      }

      .popover-form__field {
        width: 100%;
      }

      .popover-form__field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
    `,
  ],
  standalone: false
})
export class NgxPopoverFormComponent {
}

@Component({
  selector: 'ngx-popover-card',
  template: `
    <mat-card class="popover-preview-card">
      <mat-card-header>
        <mat-card-title>Hello!</mat-card-title>
      </mat-card-header>
      <mat-card-content class="popover-preview-card__content">
        Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,
        there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the
        Semantics, a large language ocean.
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .popover-preview-card {
        margin: 0;
        max-width: 20rem;
        border: 1px solid var(--app-border);
        border-radius: 1rem;
        background: var(--app-surface-elevated);
        box-shadow: none;
      }

      .popover-preview-card__content {
        color: var(--app-text-muted);
        line-height: 1.55;
      }
    `,
  ],
  standalone: false
})
export class NgxPopoverCardComponent {
}
