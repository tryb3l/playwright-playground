import { Component } from '@angular/core';

@Component({
  selector: 'ngx-request-password',
  standalone: false,
  template: `
    <mat-card-header>Request Password</mat-card-header>
    <mat-card-content class="auth-content">
      <p class="help">Enter your email and we will send a reset link.</p>
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" />
      </mat-form-field>
    </mat-card-content>
    <mat-card-footer class="auth-footer">
      <button mat-raised-button color="primary">Request</button>
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

      .help {
        margin: 0;
        color: #8f9bb3;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class RequestPasswordComponent {}
