import { Component } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  standalone: false,
  template: `
    <div class="auth-layout">
      <div class="auth-main">
        <a class="brand" routerLink="/pages/iot-dashboard">PW-test</a>
        <mat-card class="auth-card">
          <router-outlet></router-outlet>
        </mat-card>
      </div>
      <ngx-footer></ngx-footer>
    </div>
  `,
  styles: [
    `
      .auth-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(160deg, #f7f9fc 0%, #edf1f7 100%);
      }

      .auth-main {
        flex: 1 1 auto;
        padding: 2rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      .brand {
        font-size: 1.5rem;
        font-weight: 700;
        color: #222b45;
        text-decoration: none;
      }

      .auth-card {
        width: min(28rem, calc(100vw - 2rem));
        border-radius: 0.75rem;
        border: 1px solid #dfe4ea;
        box-shadow: 0 8px 24px rgba(34, 43, 69, 0.08);
      }
    `,
  ],
})
export class AuthComponent {}
