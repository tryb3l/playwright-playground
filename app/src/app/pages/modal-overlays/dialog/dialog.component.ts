import { TemplateRef } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { filter, take } from 'rxjs';

import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { DialogNamePromptComponent } from './dialog-name-prompt/dialog-name-prompt.component';

type TemplateDialogData = string;

@Component({
  selector: 'ngx-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
  standalone: false
})
export class DialogComponent {
  private readonly dialogPanelClass = 'app-dialog-panel';
  private readonly dialogCopy = 'this is some additional data passed to dialog';

  names: string[] = [];

  constructor(private readonly dialog: MatDialog) { }

  open(): void {
    this.dialog.open(ShowcaseDialogComponent, {
      data: {
        title: 'This is a title passed to the dialog component',
      },
      autoFocus: false,
      maxWidth: '38rem',
      panelClass: this.dialogPanelClass,
    });
  }

  open2(dialog: TemplateRef<TemplateDialogData>): void {
    this.openTemplateDialog(dialog, {
      data: this.dialogCopy,
      autoFocus: false,
    });
  }

  open3(): void {
    this.dialog.open(DialogNamePromptComponent, {
      autoFocus: true,
      maxWidth: '28rem',
      panelClass: this.dialogPanelClass,
    })
      .afterClosed()
      .pipe(take(1))
      .subscribe((name: string | undefined) => {
        if (name) {
          this.names.push(name);
        }
      });
  }

  openWithoutBackdrop(dialog: TemplateRef<TemplateDialogData>): void {
    this.openTemplateDialog(dialog, {
      data: this.dialogCopy,
      autoFocus: false,
      hasBackdrop: false,
    });
  }

  openWithoutBackdropClick(dialog: TemplateRef<TemplateDialogData>): void {
    const dialogRef = this.openTemplateDialog(dialog, {
      data: this.dialogCopy,
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.keydownEvents()
      .pipe(
        filter((event) => event.key === 'Escape'),
        take(1),
      )
      .subscribe(() => dialogRef.close());
  }

  openWithoutEscClose(dialog: TemplateRef<TemplateDialogData>): void {
    const dialogRef = this.openTemplateDialog(dialog, {
      data: this.dialogCopy,
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.backdropClick()
      .pipe(take(1))
      .subscribe(() => dialogRef.close());
  }

  private openTemplateDialog(
    dialog: TemplateRef<TemplateDialogData>,
    config: MatDialogConfig<TemplateDialogData>,
  ): MatDialogRef<unknown> {
    return this.dialog.open(dialog, {
      maxWidth: '34rem',
      panelClass: this.dialogPanelClass,
      ...config,
    });
  }
}
