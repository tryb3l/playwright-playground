import { Component } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { ToastPreviewComponent, ToastStatus } from './toast-preview.component';

type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-end'
  | 'top-start'
  | 'bottom-end'
  | 'bottom-start';

@Component({
  selector: 'ngx-toastr',
  styleUrls: ['./toastr.component.scss'],
  templateUrl: './toastr.component.html',
  standalone: false
})
export class ToastrComponent {
  constructor(private readonly snackBar: MatSnackBar) { }

  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: ToastPosition = 'top-right';
  preventDuplicates = false;
  status: ToastStatus = 'primary';

  title = 'HI there!';
  content = `I'm cool toaster!`;

  types: ToastStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  positions: ToastPosition[] = [
    'top-right',
    'top-left',
    'bottom-left',
    'bottom-right',
    'top-end',
    'top-start',
    'bottom-end',
    'bottom-start',
  ];

  quotes = [
    { title: null, body: 'We rock at Angular' },
    { title: null, body: 'Titles are not always needed' },
    { title: null, body: 'Toastr rock!' },
  ];

  makeToast() {
    this.showToast(this.status, this.title, this.content);
  }

  openRandomToast() {
    const typeIndex = Math.floor(Math.random() * this.types.length);
    const quoteIndex = Math.floor(Math.random() * this.quotes.length);
    const type = this.types[typeIndex];
    const quote = this.quotes[quoteIndex];

    this.showToast(type, quote.title, quote.body);
  }

  private showToast(type: ToastStatus, title: string | null, body: string) {
    const titleContent = title ? `. ${title}` : '';
    const toastKey = `${type}|${titleContent}|${body}`;

    if (this.preventDuplicates && toastKey === this.lastToastKey) {
      return;
    }

    const { horizontalPosition, verticalPosition } = this.resolvePosition(this.position);

    this.index += 1;
    const snackBarRef = this.snackBar.openFromComponent(ToastPreviewComponent, {
      duration: this.duration > 0 ? this.duration : undefined,
      horizontalPosition,
      verticalPosition,
      panelClass: ['app-toast-panel'],
      data: {
        title: `Toast ${this.index}${titleContent}`,
        content: body,
        status: type,
        hasIcon: this.hasIcon,
        destroyByClick: this.destroyByClick,
      },
    });

    this.lastToastKey = toastKey;
    snackBarRef.afterDismissed().subscribe(() => {
      if (this.lastToastKey === toastKey) {
        this.lastToastKey = null;
      }
    });
  }

  private lastToastKey: string | null = null;

  private resolvePosition(position: ToastPosition): {
    horizontalPosition: MatSnackBarHorizontalPosition;
    verticalPosition: MatSnackBarVerticalPosition;
  } {
    switch (position) {
      case 'top-left':
      case 'top-start':
        return { horizontalPosition: 'start', verticalPosition: 'top' };
      case 'bottom-left':
      case 'bottom-start':
        return { horizontalPosition: 'start', verticalPosition: 'bottom' };
      case 'bottom-right':
      case 'bottom-end':
        return { horizontalPosition: 'end', verticalPosition: 'bottom' };
      case 'top-right':
      case 'top-end':
      default:
        return { horizontalPosition: 'end', verticalPosition: 'top' };
    }
  }
}
