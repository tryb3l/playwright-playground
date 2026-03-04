import { Component } from '@angular/core';

@Component({
  selector: 'ngx-reset-password',
  standalone: false,
  template: `
    <mat-card-header>Reset Password</mat-card-header>
    <mat-card-content class="auth-content">
      <mat-form-field appearance="outline">
        <mat-label>New password</mat-label>
        <input matInput type="password" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Confirm password</mat-label>
        <input matInput type="password" />
      </mat-form-field>
    </mat-card-content>
    <mat-card-footer class="auth-footer">
      <button mat-raised-button color="primary" routerLink="/auth/login">
        Save Password
      </button>
      <a routerLink="/auth/login">Back to login</a>
    </mat-card-footer>
  `,
  styles: [
    `
      .auth-content {
        display: grid;
        gap: 0.75rem;
      }

      .auth-footer {
        display: grid;
        gap: 0.625rem;
      }
    `,
  ],
})
export class ResetPasswordComponent {}
