import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbAuthSocialLink, getDeepFromObject } from '@nebular/auth';

type AuthMode = 'login' | 'register' | 'request-password' | 'reset-password';

interface AuthPageMeta {
    title: string;
    subtitle: string;
    submitLabel: string;
    helperLinks: Array<{ label: string; link: string }>;
}

interface AuthUserModel {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    rememberMe?: boolean;
}

const authPageMeta: Record<AuthMode, AuthPageMeta> = {
    login: {
        title: 'Login',
        subtitle: 'Use the demo email strategy to access the migrated application.',
        submitLabel: 'Log In',
        helperLinks: [
            { label: 'Forgot password?', link: '/auth/request-password' },
            { label: 'Need an account? Register', link: '/auth/register' },
        ],
    },
    register: {
        title: 'Register',
        subtitle: 'Create a demo account flow without Nebular auth components.',
        submitLabel: 'Create Account',
        helperLinks: [
            { label: 'Already have an account? Sign in', link: '/auth/login' },
        ],
    },
    'request-password': {
        title: 'Request Password',
        subtitle: 'Enter your email and the demo strategy will simulate a reset link request.',
        submitLabel: 'Send Reset Link',
        helperLinks: [
            { label: 'Back to login', link: '/auth/login' },
        ],
    },
    'reset-password': {
        title: 'Reset Password',
        subtitle: 'Set a new password to complete the migrated auth demo flow.',
        submitLabel: 'Reset Password',
        helperLinks: [
            { label: 'Request a new reset link', link: '/auth/request-password' },
            { label: 'Back to login', link: '/auth/login' },
        ],
    },
};

@Component({
    selector: 'ngx-auth-form-page',
    templateUrl: './auth-form-page.component.html',
    styleUrls: ['./auth-form-page.component.scss'],
    standalone: false,
})
export class AuthFormPageComponent implements OnInit {
    mode!: AuthMode;
    meta!: AuthPageMeta;

    redirectDelay = 500;
    strategy = 'email';
    fullNameRequired = false;
    rememberMeEnabled = false;
    socialLinks: NbAuthSocialLink[] = [];
    submitted = false;
    errors: string[] = [];
    messages: string[] = [];

    user: AuthUserModel = {
        rememberMe: false,
    };

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly authService: NbAuthService,
        @Inject(NB_AUTH_OPTIONS) private readonly options: Record<string, unknown>,
    ) { }

    ngOnInit(): void {
        this.mode = this.route.snapshot.data['mode'] as AuthMode;
        this.meta = authPageMeta[this.mode];

        const formKey = this.getFormKey(this.mode);
        this.redirectDelay = this.getConfigValue(`forms.${formKey}.redirectDelay`, 500);
        this.strategy = this.getConfigValue(`forms.${formKey}.strategy`, 'email');
        this.fullNameRequired = this.getConfigValue('forms.validation.fullName.required', false);
        this.rememberMeEnabled = this.mode === 'login' && this.getConfigValue('forms.login.rememberMe', true);
        this.socialLinks = this.mode === 'request-password' || this.mode === 'reset-password'
            ? []
            : this.getConfigValue(`forms.${formKey}.socialLinks`, this.getConfigValue('forms.login.socialLinks', []));
    }

    get pageTestId(): string {
        return `auth-page-${this.mode}`;
    }

    get showFullName(): boolean {
        return this.mode === 'register';
    }

    get showEmail(): boolean {
        return this.mode !== 'reset-password';
    }

    get showPassword(): boolean {
        return this.mode !== 'request-password';
    }

    get showConfirmPassword(): boolean {
        return this.mode === 'register' || this.mode === 'reset-password';
    }

    submit(): void {
        this.errors = [];
        this.messages = [];

        const validationErrors = this.validateBeforeSubmit();
        if (validationErrors.length > 0) {
            this.errors = validationErrors;
            return;
        }

        this.submitted = true;
        this.getRequest().subscribe({
            next: (result) => this.handleResult(result),
            error: () => {
                this.submitted = false;
                this.errors = ['Something went wrong while processing the auth request.'];
            },
        });
    }

    getSocialLinkLabel(link: NbAuthSocialLink): string {
        if (link.title) {
            return link.title;
        }

        if (link.icon) {
            return `Continue with ${link.icon}`;
        }

        return 'Open social auth link';
    }

    getSocialLinkUrl(link: NbAuthSocialLink): string {
        return link.link || link.url || '#';
    }

    getSocialIconClass(icon?: string): string {
        switch (icon) {
            case 'github':
                return 'fa-brands fa-github';
            case 'facebook':
                return 'fa-brands fa-facebook-f';
            case 'twitter':
                return 'fa-brands fa-x-twitter';
            default:
                return 'fa-solid fa-share-nodes';
        }
    }

    hasPasswordMismatch(): boolean {
        return this.showConfirmPassword
            && !!this.user.confirmPassword
            && this.user.password !== this.user.confirmPassword;
    }

    private getRequest() {
        switch (this.mode) {
            case 'login':
                return this.authService.authenticate(this.strategy, this.user);
            case 'register':
                return this.authService.register(this.strategy, this.user);
            case 'request-password':
                return this.authService.requestPassword(this.strategy, { email: this.user.email });
            case 'reset-password':
                return this.authService.resetPassword(this.strategy, this.user);
        }
    }

    private handleResult(result: NbAuthResult): void {
        this.submitted = false;
        this.messages = result.getMessages();
        this.errors = result.getErrors();

        const redirect = result.getRedirect();
        if (redirect) {
            window.setTimeout(() => {
                this.router.navigateByUrl(redirect);
            }, this.redirectDelay);
        }
    }

    private validateBeforeSubmit(): string[] {
        const errors: string[] = [];
        const emailRequired = this.getConfigValue('forms.validation.email.required', true);
        const passwordRequired = this.getConfigValue('forms.validation.password.required', true);
        const passwordMinLength = this.getConfigValue('forms.validation.password.minLength', 4);
        const fullNameRequired = this.getConfigValue('forms.validation.fullName.required', false);
        const fullNameMinLength = this.getConfigValue('forms.validation.fullName.minLength', 4);

        if (this.showFullName && fullNameRequired && !this.user.fullName?.trim()) {
            errors.push('Full name is required.');
        }

        if (this.showFullName && this.user.fullName && this.user.fullName.trim().length < fullNameMinLength) {
            errors.push(`Full name should contain at least ${fullNameMinLength} characters.`);
        }

        if (this.showEmail && emailRequired && !this.user.email?.trim()) {
            errors.push('Email is required.');
        }

        if (this.showEmail && this.user.email && !/.+@.+\..+/.test(this.user.email)) {
            errors.push('Email should be the real one.');
        }

        if (this.showPassword && passwordRequired && !this.user.password) {
            errors.push('Password is required.');
        }

        if (this.showPassword && this.user.password && this.user.password.length < passwordMinLength) {
            errors.push(`Password should contain at least ${passwordMinLength} characters.`);
        }

        if (this.hasPasswordMismatch()) {
            errors.push('Passwords do not match.');
        }

        return errors;
    }

    private getFormKey(mode: AuthMode): string {
        switch (mode) {
            case 'request-password':
                return 'requestPassword';
            case 'reset-password':
                return 'resetPassword';
            default:
                return mode;
        }
    }

    private getConfigValue<T>(key: string, fallback: T): T {
        return getDeepFromObject(this.options, key, fallback) as T;
    }
}