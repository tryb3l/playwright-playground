import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {
    BehaviorSubject,
    Observable,
    distinctUntilChanged,
    fromEvent,
    map,
    of,
    pairwise,
    startWith,
} from 'rxjs';
import { CORPORATE_THEME as CORPORATE_JS_THEME } from '../styles/theme.corporate';
import { COSMIC_THEME as COSMIC_JS_THEME } from '../styles/theme.cosmic';
import { DARK_THEME as DARK_JS_THEME } from '../styles/theme.dark';
import { DEFAULT_THEME as DEFAULT_JS_THEME } from '../styles/theme.default';

export type AppThemeName = 'default' | 'dark' | 'cosmic' | 'corporate';
export type AppBreakpointName = 'xs' | 'is' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export interface AppMediaBreakpoint {
    name: AppBreakpointName;
    width: number;
}

export interface AppJsThemeOptions {
    name: AppThemeName;
    variables: Record<string, any>;
    [key: string]: any;
}

interface AppThemeTokens {
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSoft: string;
    sidebar: string;
    shadow: string;
}

export interface AppThemeOption {
    name: AppThemeName;
    label: string;
    colorScheme: 'light' | 'dark';
    tokens: AppThemeTokens;
}

export const APP_THEME_OPTIONS: ReadonlyArray<AppThemeOption> = [
    {
        name: 'default',
        label: 'Light',
        colorScheme: 'light',
        tokens: {
            background: '#eef3f7',
            surface: '#ffffff',
            surfaceElevated: 'rgba(255, 255, 255, 0.92)',
            border: 'rgba(28, 44, 67, 0.14)',
            text: '#17273f',
            textMuted: '#66788f',
            accent: '#0f766e',
            accentSoft: 'rgba(15, 118, 110, 0.14)',
            sidebar: 'rgba(255, 255, 255, 0.82)',
            shadow: '0 18px 48px rgba(15, 23, 42, 0.12)',
        },
    },
    {
        name: 'dark',
        label: 'Dark',
        colorScheme: 'dark',
        tokens: {
            background: '#0e1627',
            surface: '#162238',
            surfaceElevated: 'rgba(22, 34, 56, 0.94)',
            border: 'rgba(148, 163, 184, 0.22)',
            text: '#edf3ff',
            textMuted: '#9fb0c9',
            accent: '#60a5fa',
            accentSoft: 'rgba(96, 165, 250, 0.18)',
            sidebar: 'rgba(16, 24, 40, 0.82)',
            shadow: '0 20px 56px rgba(2, 6, 23, 0.44)',
        },
    },
    {
        name: 'cosmic',
        label: 'Cosmic',
        colorScheme: 'dark',
        tokens: {
            background: '#120d25',
            surface: '#201242',
            surfaceElevated: 'rgba(32, 18, 66, 0.94)',
            border: 'rgba(199, 210, 254, 0.2)',
            text: '#f3e8ff',
            textMuted: '#c7b8ff',
            accent: '#f97316',
            accentSoft: 'rgba(249, 115, 22, 0.18)',
            sidebar: 'rgba(24, 15, 48, 0.82)',
            shadow: '0 24px 64px rgba(8, 4, 19, 0.52)',
        },
    },
    {
        name: 'corporate',
        label: 'Corporate',
        colorScheme: 'light',
        tokens: {
            background: '#f4f7fb',
            surface: '#ffffff',
            surfaceElevated: 'rgba(255, 255, 255, 0.96)',
            border: 'rgba(15, 23, 42, 0.1)',
            text: '#122033',
            textMuted: '#5d6d83',
            accent: '#1d4ed8',
            accentSoft: 'rgba(29, 78, 216, 0.12)',
            sidebar: 'rgba(255, 255, 255, 0.9)',
            shadow: '0 18px 50px rgba(30, 41, 59, 0.1)',
        },
    },
];

const APP_THEME_LOOKUP = APP_THEME_OPTIONS.reduce(
    (themes, theme) => ({ ...themes, [theme.name]: theme }),
    {} as Record<AppThemeName, AppThemeOption>,
);

const APP_JS_THEME_LOOKUP: Record<AppThemeName, AppJsThemeOptions> = {
    default: DEFAULT_JS_THEME as AppJsThemeOptions,
    dark: DARK_JS_THEME as AppJsThemeOptions,
    cosmic: COSMIC_JS_THEME as AppJsThemeOptions,
    corporate: CORPORATE_JS_THEME as AppJsThemeOptions,
};

const APP_MEDIA_BREAKPOINTS: ReadonlyArray<AppMediaBreakpoint> = [
    { name: 'xs', width: 0 },
    { name: 'is', width: 400 },
    { name: 'sm', width: 576 },
    { name: 'md', width: 768 },
    { name: 'lg', width: 992 },
    { name: 'xl', width: 1200 },
    { name: 'xxl', width: 1400 },
    { name: 'xxxl', width: 1600 },
];

const APP_BREAKPOINTS_MAP = APP_MEDIA_BREAKPOINTS.reduce(
    (breakpoints, breakpoint) => ({
        ...breakpoints,
        [breakpoint.name]: breakpoint.width,
    }),
    {} as Record<AppBreakpointName, number>,
);

@Injectable({
    providedIn: 'root',
})
export class AppThemeService {
    private readonly storageKey = 'ngx-admin.app-theme';
    private readonly themeSubject = new BehaviorSubject<AppThemeName>('default');
    private initialized = false;
    private overlayObserver?: MutationObserver;

    readonly theme$ = this.themeSubject.asObservable();

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly nebularThemeService: NbThemeService,
    ) { }

    get currentTheme(): AppThemeName {
        return this.themeSubject.value;
    }

    changeTheme(themeName: AppThemeName): void {
        this.setTheme(themeName);
    }

    getJsTheme(): Observable<AppJsThemeOptions> {
        return this.theme$.pipe(
            map((themeName) => APP_JS_THEME_LOOKUP[themeName]),
            distinctUntilChanged((previous, current) => previous.name === current.name),
        );
    }

    onThemeChange(): Observable<{ name: AppThemeName }> {
        return this.theme$.pipe(
            map((name) => ({ name })),
            distinctUntilChanged((previous, current) => previous.name === current.name),
        );
    }

    getBreakpointsMap(): Record<AppBreakpointName, number> {
        return APP_BREAKPOINTS_MAP;
    }

    getCurrentBreakpoint(): AppMediaBreakpoint {
        return this.resolveBreakpoint(this.document.defaultView?.innerWidth ?? 0);
    }

    onMediaQueryChange(): Observable<[AppMediaBreakpoint, AppMediaBreakpoint]> {
        const view = this.document.defaultView;
        const initialBreakpoint = this.getCurrentBreakpoint();

        if (!view) {
            return of([initialBreakpoint, initialBreakpoint]);
        }

        return fromEvent(view, 'resize').pipe(
            map(() => this.resolveBreakpoint(view.innerWidth)),
            startWith(initialBreakpoint),
            distinctUntilChanged((previous, current) => previous.name === current.name),
            pairwise(),
            startWith([initialBreakpoint, initialBreakpoint] as [AppMediaBreakpoint, AppMediaBreakpoint]),
        );
    }

    initialize(): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.observeOverlayContainers();
        const initialTheme = this.readStoredTheme() ?? this.resolveSystemTheme();
        this.applyTheme(initialTheme);
    }

    setTheme(themeName: AppThemeName): void {
        this.persistTheme(themeName);
        this.applyTheme(themeName);
    }

    private applyTheme(themeName: AppThemeName): void {
        const theme = APP_THEME_LOOKUP[themeName];
        const root = this.document.documentElement;
        const body = this.document.body;

        this.applyThemeMetadata(root, theme);
        if (body) {
            this.applyThemeMetadata(body, theme);
        }
        this.applyThemeToOverlayContainers(theme);

        this.nebularThemeService.changeTheme(theme.name);
        this.themeSubject.next(theme.name);
    }

    private observeOverlayContainers(): void {
        if (!this.document.body || typeof MutationObserver === 'undefined' || this.overlayObserver) {
            return;
        }

        this.overlayObserver = new MutationObserver(() => {
            this.applyThemeToOverlayContainers(APP_THEME_LOOKUP[this.currentTheme]);
        });

        this.overlayObserver.observe(this.document.body, {
            childList: true,
            subtree: true,
        });
    }

    private applyThemeToOverlayContainers(theme: AppThemeOption): void {
        const overlayContainers = this.document.querySelectorAll<HTMLElement>('.cdk-overlay-container');

        for (const overlayContainer of Array.from(overlayContainers)) {
            this.applyThemeMetadata(overlayContainer, theme);
        }
    }

    private applyThemeMetadata(target: HTMLElement, theme: AppThemeOption): void {
        target.dataset['appTheme'] = theme.name;
        target.style.colorScheme = theme.colorScheme;
        this.replaceThemeClass(target.classList, theme.name);

        for (const [tokenName, tokenValue] of Object.entries(theme.tokens)) {
            target.style.setProperty(`--app-${this.toKebabCase(tokenName)}`, tokenValue);
        }
    }

    private replaceThemeClass(classList: DOMTokenList, themeName: AppThemeName): void {
        for (const theme of APP_THEME_OPTIONS) {
            classList.remove(`app-theme-${theme.name}`);
        }

        classList.add(`app-theme-${themeName}`);
    }

    private readStoredTheme(): AppThemeName | null {
        try {
            const storedTheme = this.document.defaultView?.localStorage.getItem(this.storageKey) ?? null;
            return this.isThemeName(storedTheme) ? storedTheme : null;
        } catch {
            return null;
        }
    }

    private persistTheme(themeName: AppThemeName): void {
        try {
            this.document.defaultView?.localStorage.setItem(this.storageKey, themeName);
        } catch {
            // Ignore storage failures and keep the session theme in memory.
        }
    }

    private resolveSystemTheme(): AppThemeName {
        const prefersDark = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
        return prefersDark ? 'dark' : 'default';
    }

    private resolveBreakpoint(viewportWidth: number): AppMediaBreakpoint {
        for (let index = APP_MEDIA_BREAKPOINTS.length - 1; index >= 0; index -= 1) {
            const breakpoint = APP_MEDIA_BREAKPOINTS[index];
            if (viewportWidth >= breakpoint.width) {
                return breakpoint;
            }
        }

        return APP_MEDIA_BREAKPOINTS[0];
    }

    private isThemeName(value: string | null): value is AppThemeName {
        return APP_THEME_OPTIONS.some((theme) => theme.name === value);
    }

    private toKebabCase(value: string): string {
        return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    }
}