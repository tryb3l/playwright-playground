import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { WindowFormComponent } from './window-form/window-form.component';

interface WindowTemplateData {
  title: string;
  text: string;
}

@Component({
    selector: 'ngx-window',
    templateUrl: 'window.component.html',
    styleUrls: ['window.component.scss'],
    standalone: false
})
export class WindowComponent {
  private readonly windowPanelClass = 'app-window-panel';

  @ViewChild('disabledEsc', { read: TemplateRef, static: true })
  disabledEscTemplate: TemplateRef<WindowTemplateData>;

  constructor(private readonly dialog: MatDialog) {}

  openWindow(contentTemplate: TemplateRef<WindowTemplateData>): void {
    this.openTemplateWindow(
      contentTemplate,
      {
        data: {
          title: 'Window content from template',
          text: 'some text to pass into template',
        },
        autoFocus: false,
      },
    );
  }

  openWindowForm(): void {
    this.dialog.open(WindowFormComponent, {
      autoFocus: true,
      maxWidth: '32rem',
      panelClass: this.windowPanelClass,
    });
  }

  openWindowWithoutBackdrop(): void {
    this.openTemplateWindow(
      this.disabledEscTemplate,
      {
        data: {
          title: 'Window without backdrop',
          text: 'Disabled close on escape click.',
        },
        hasBackdrop: false,
        disableClose: true,
        autoFocus: false,
      },
    );
  }

  private openTemplateWindow(
    windowTemplate: TemplateRef<WindowTemplateData>,
    config: MatDialogConfig<WindowTemplateData>,
  ): MatDialogRef<unknown> {
    return this.dialog.open(windowTemplate, {
      maxWidth: '34rem',
      panelClass: this.windowPanelClass,
      ...config,
    });
  }
}
