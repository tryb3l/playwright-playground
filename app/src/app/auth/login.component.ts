import { Component } from '@angular/core';

@Component({
  selector: 'ngx-login',
  standalone: false,
  template: `
    <mat-card-header>Sign In</mat-card-header>
    <mat-card-content class="auth-content">
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Password</mat-label>
        <input matInput type="password" />
      </mat-form-field>
    </mat-card-content>
    <mat-card-footer class="auth-footer">
      <button
        mat-raised-button
        color="primary"
        routerLink="/pages/iot-dashboard"
      >
        Sign In
      </button>
      <a routerLink="/auth/request-password">Forgot password?</a>
      <a routerLink="/auth/register">Create account</a>
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

      a {
        font-size: 0.875rem;
        text-decoration: none;
      }
    `,
  ],
})
export class LoginComponent {}
