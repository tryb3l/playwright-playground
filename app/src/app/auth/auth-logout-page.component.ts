import { Inject } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService, getDeepFromObject } from '@nebular/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ngx-auth-logout-page',
    template: `
    <section class="auth-card auth-card--logout" data-testid="auth-page-logout">
      <p class="auth-card__eyebrow">logout</p>
      <h2 class="auth-card__title">Logging out</h2>
      <p class="auth-card__subtitle">Clearing the current demo auth session and redirecting you back into the app.</p>
      <div class="logout-spinner" aria-hidden="true"></div>
    </section>
  `,
    styleUrls: ['./auth-form-page.component.scss'],
    standalone: false,
})
export class AuthLogoutPageComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly authService: NbAuthService,
        private readonly router: Router,
        @Inject(NB_AUTH_OPTIONS) private readonly options: Record<string, unknown>,
    ) { }

    ngOnInit(): void {
        const strategy = getDeepFromObject(this.options, 'forms.logout.strategy', 'email') as string;
        const redirectDelay = getDeepFromObject(this.options, 'forms.logout.redirectDelay', 500) as number;

        this.authService.logout(strategy)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                window.setTimeout(() => {
                    this.router.navigateByUrl('/auth/login');
                }, redirectDelay);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}