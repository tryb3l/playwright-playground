import { Component, Inject } from '@angular/core';
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBarRef,
} from '@angular/material/snack-bar';

export type ToastStatus = 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface ToastPreviewData {
    title: string;
    content: string;
    status: ToastStatus;
    hasIcon: boolean;
    destroyByClick: boolean;
}

@Component({
    selector: 'ngx-toast-preview',
    standalone: false,
    template: `
    <div
      class="app-toast"
      data-testid="app-toast"
      [ngClass]="'app-toast--' + data.status"
      (click)="dismissIfAllowed()"
    >
      @if (data.hasIcon) {
        <span class="app-toast__icon fa-solid" [ngClass]="iconClass" aria-hidden="true"></span>
      }

      <div class="app-toast__copy">
        <div class="app-toast__title" data-testid="app-toast-title">{{ data.title }}</div>
        <div class="app-toast__body" data-testid="app-toast-content">{{ data.content }}</div>
      </div>
    </div>
  `,
    styles: [
        `
      .app-toast {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        min-width: min(24rem, 80vw);
        padding: 1rem 1.1rem;
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: var(--app-surface-elevated);
        color: var(--app-text);
        box-shadow: var(--app-shadow);
        cursor: pointer;
      }

      .app-toast__icon {
        margin-top: 0.15rem;
        color: currentColor;
      }

      .app-toast__copy {
        display: grid;
        gap: 0.2rem;
      }

      .app-toast__title {
        font-weight: 700;
      }

      .app-toast__body {
        color: var(--app-text-muted);
      }

      .app-toast--primary {
        border-color: rgba(59, 130, 246, 0.24);
      }

      .app-toast--success {
        border-color: rgba(34, 197, 94, 0.26);
      }

      .app-toast--info {
        border-color: rgba(56, 189, 248, 0.26);
      }

      .app-toast--warning {
        border-color: rgba(245, 158, 11, 0.3);
      }

      .app-toast--danger {
        border-color: rgba(239, 68, 68, 0.28);
      }
    `,
    ],
})
export class ToastPreviewComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public readonly data: ToastPreviewData,
        private readonly snackBarRef: MatSnackBarRef<ToastPreviewComponent>,
    ) { }

    get iconClass(): string {
        switch (this.data.status) {
            case 'success':
                return 'fa-circle-check';
            case 'warning':
                return 'fa-triangle-exclamation';
            case 'danger':
                return 'fa-circle-xmark';
            case 'info':
            case 'primary':
            default:
                return 'fa-circle-info';
        }
    }

    dismissIfAllowed(): void {
        if (this.data.destroyByClick) {
            this.snackBarRef.dismiss();
        }
    }
}