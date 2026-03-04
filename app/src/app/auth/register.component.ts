import { Component } from '@angular/core';

@Component({
  selector: 'ngx-register',
  standalone: false,
  template: `
    <mat-card-header>Create Account</mat-card-header>
    <mat-card-content class="auth-content">
      <mat-form-field appearance="outline">
        <mat-label>Full name</mat-label>
        <input matInput />
      </mat-form-field>

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
        Create Account
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
export class RegisterComponent {}
