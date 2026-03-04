import { OverlayContainer } from '@angular/cdk/overlay';
import { TemplateRef, Type, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CORPORATE_THEME,
  COSMIC_THEME,
  DARK_THEME,
  DEFAULT_THEME,
} from '../../@theme/styles/theme.mock';

export interface NbMediaBreakpoint {
  name: string;
  width: number;
}

export type NbComponentSize = 'tiny' | 'small' | 'medium' | 'large' | 'giant';

@Injectable({ providedIn: 'root' })
export class NbDateService<D> {
  addDay(date: D, days: number): D {
    const copy = this.toDate(date);
    copy.setDate(copy.getDate() + days);
    return copy as D;
  }

  addMonth(date: D, months: number): D {
    const copy = this.toDate(date);
    copy.setMonth(copy.getMonth() + months);
    return copy as D;
  }

  getMonthStart(date: D): D {
    const value = this.toDate(date);
    return new Date(value.getFullYear(), value.getMonth(), 1) as D;
  }

  getMonthEnd(date: D): D {
    const value = this.toDate(date);
    return new Date(value.getFullYear(), value.getMonth() + 1, 0) as D;
  }

  getMonth(date: D): number {
    return this.toDate(date).getMonth();
  }
  getYear(date: D): number {
    return this.toDate(date).getFullYear();
  }
  getDate(date: D): number {
    return this.toDate(date).getDate();
  }
  getDayOfWeek(date: D): number {
    return this.toDate(date).getDay();
  }
  today(): D {
    return new Date() as D;
  }
  clone(date: D): D {
    return new Date(this.toDate(date)) as D;
  }

  compareDates(d1: D, d2: D): number {
    return this.toDate(d1).getTime() - this.toDate(d2).getTime();
  }

  createDate(year: number, month: number, date: number): D {
    return new Date(year, month, date) as D;
  }

  private toDate(value: D): Date {
    return value instanceof Date ? new Date(value) : new Date(value as any);
  }
}

export interface NbCalendarRange<D> {
  start: D;
  end?: D;
}

@Injectable({ providedIn: 'root' })
export class NbDialogService {
  constructor(private dialog: MatDialog) {}

  open(content: Type<any> | TemplateRef<any>, config: any = {}): NbDialogRef {
    const disableEsc = config.closeOnEsc === false;
    const disableBackdrop = config.closeOnBackdropClick === false;
    const dialogConfig: MatDialogConfig = {
      hasBackdrop: config.hasBackdrop !== false,
      disableClose: disableEsc || disableBackdrop,
      data: config.context,
      autoFocus: false,
      restoreFocus: true,
    };

    const dialogRef = this.dialog.open(content, dialogConfig as any);

    if (disableEsc && !disableBackdrop) {
      dialogRef.backdropClick().subscribe(() => dialogRef.close());
    }
    if (disableBackdrop && !disableEsc) {
      dialogRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape') {
          dialogRef.close();
        }
      });
    }

    if (
      config.context &&
      dialogRef.componentInstance &&
      typeof config.context === 'object'
    ) {
      Object.assign(dialogRef.componentInstance, config.context);
    }

    return new NbDialogRef(dialogRef);
  }
}

export class NbDialogRef<T = any> {
  private readonly onClose$ = new Subject<any>();
  readonly onClose: Observable<any>;

  constructor(private dialogRef?: MatDialogRef<any>) {
    this.onClose = this.dialogRef
      ? this.dialogRef.afterClosed()
      : this.onClose$.asObservable();
  }

  close(res?: any) {
    if (this.dialogRef) {
      this.dialogRef.close(res);
      return;
    }
    this.onClose$.next(res);
    this.onClose$.complete();
  }
}

@Injectable({ providedIn: 'root' })
export class NbWindowService {
  constructor(private dialog: MatDialog) {}

  open(content: Type<any> | TemplateRef<any>, config: any = {}): NbWindowRef {
    const disableEsc = config.closeOnEsc === false;
    const disableBackdrop = config.closeOnBackdropClick === false;
    const dialogConfig: MatDialogConfig = {
      hasBackdrop: config.hasBackdrop !== false,
      disableClose: disableEsc || disableBackdrop,
      data: config.context,
      autoFocus: false,
      restoreFocus: true,
      panelClass: ['ngx-window-panel'],
      minWidth: '320px',
    };

    const dialogRef = this.dialog.open(content, dialogConfig as any);

    if (disableEsc && !disableBackdrop) {
      dialogRef.backdropClick().subscribe(() => dialogRef.close());
    }
    if (disableBackdrop && !disableEsc) {
      dialogRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape') {
          dialogRef.close();
        }
      });
    }

    return new NbWindowRef(dialogRef);
  }
}

export class NbWindowRef<T = any> extends NbDialogRef<T> {}

@Injectable({ providedIn: 'root' })
export class NbLayoutDirectionService {
  onDirectionChange() {
    return of(NbLayoutDirection.LTR);
  }
  getDirection() {
    return NbLayoutDirection.LTR;
  }
}

export enum NbLayoutDirection {
  LTR = 'ltr',
  RTL = 'rtl',
}

export type NbComponentStatus =
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'basic'
  | 'control';

export enum NbGlobalPhysicalPosition {
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left',
}

export enum NbGlobalLogicalPosition {
  TOP_START = 'top-start',
  TOP_END = 'top-end',
  BOTTOM_START = 'bottom-start',
  BOTTOM_END = 'bottom-end',
}

export type NbGlobalPosition =
  | NbGlobalPhysicalPosition
  | NbGlobalLogicalPosition;

@Injectable({ providedIn: 'root' })
export class NbToastrService {
  private lastToastKey: string | null = null;

  constructor(private snackBar: MatSnackBar) {}

  show(body: string, title?: string, config: any = {}) {
    const key = `${title || ''}::${body}::${config.status || 'primary'}`;
    if (config.preventDuplicates && key === this.lastToastKey) {
      return;
    }
    this.lastToastKey = key;

    const position = this.mapPosition(config.position);
    const duration =
      config.duration === 0 ? undefined : (config.duration ?? 3000);
    const message = title ? `${title}: ${body}` : body;

    this.snackBar.open(
      message,
      config.destroyByClick === false ? undefined : 'Close',
      {
        duration,
        horizontalPosition: position.horizontalPosition,
        verticalPosition: position.verticalPosition,
        panelClass: ['ngx-toastr', `ngx-toastr-${config.status || 'primary'}`],
      }
    );
  }

  private mapPosition(
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT
  ) {
    switch (position) {
      case NbGlobalPhysicalPosition.TOP_LEFT:
      case NbGlobalLogicalPosition.TOP_START:
        return {
          horizontalPosition: 'start' as const,
          verticalPosition: 'top' as const,
        };
      case NbGlobalPhysicalPosition.BOTTOM_LEFT:
      case NbGlobalLogicalPosition.BOTTOM_START:
        return {
          horizontalPosition: 'start' as const,
          verticalPosition: 'bottom' as const,
        };
      case NbGlobalPhysicalPosition.BOTTOM_RIGHT:
      case NbGlobalLogicalPosition.BOTTOM_END:
        return {
          horizontalPosition: 'end' as const,
          verticalPosition: 'bottom' as const,
        };
      case NbGlobalPhysicalPosition.TOP_RIGHT:
      case NbGlobalLogicalPosition.TOP_END:
      default:
        return {
          horizontalPosition: 'end' as const,
          verticalPosition: 'top' as const,
        };
    }
  }
}

export interface NbToastrConfig {
  status?: NbComponentStatus;
  duration?: number;
  destroyByClick?: boolean;
  hasIcon?: boolean;
  position?: NbGlobalPosition;
  preventDuplicates?: boolean;
}

export interface NbJSThemeOptions {
  name: string;
  base?: string;
  variables?: any;
}

@Injectable({ providedIn: 'root' })
export class NbCalendarDayCellComponent<D> {
  day: D;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme$ = new BehaviorSubject<string>('default');
  private readonly themes = {
    default: DEFAULT_THEME,
    dark: DARK_THEME,
    cosmic: COSMIC_THEME,
    corporate: CORPORATE_THEME,
  } as const;

  constructor(private overlayContainer: OverlayContainer) {
    this.applyThemeClass(this.currentTheme$.value);
  }

  get currentTheme(): string {
    return this.currentTheme$.value;
  }

  onThemeChange(): Observable<{ name: string }> {
    return this.currentTheme$.asObservable().pipe(map((name) => ({ name })));
  }

  getJsTheme(): Observable<{ name: string; variables: any }> {
    return this.onThemeChange().pipe(
      map((theme) => ({
        name: theme.name,
        variables: this.themes[theme.name]
          ? this.themes[theme.name].variables
          : DEFAULT_THEME.variables,
      }))
    );
  }

  onMediaQueryChange(): Observable<[NbMediaBreakpoint, NbMediaBreakpoint]> {
    // Return a mock breakpoint
    const breakpoint: NbMediaBreakpoint = { name: 'md', width: 768 };
    return of([breakpoint, breakpoint]);
  }

  changeTheme(themeName: string) {
    this.currentTheme$.next(themeName);
    this.applyThemeClass(themeName);
  }

  getSelectedTheme(): Observable<string> {
    return this.currentTheme$.asObservable();
  }

  private applyThemeClass(themeName: string) {
    if (!document?.body) {
      return;
    }
    const themeClasses = [
      'nb-theme-default',
      'nb-theme-dark',
      'nb-theme-cosmic',
      'nb-theme-corporate',
    ];
    document.body.classList.remove(...themeClasses);
    document.body.classList.add(`nb-theme-${themeName}`);

    const containerClassList =
      this.overlayContainer.getContainerElement().classList;
    containerClassList.remove(...themeClasses);
    containerClassList.add(`nb-theme-${themeName}`);
  }
}
