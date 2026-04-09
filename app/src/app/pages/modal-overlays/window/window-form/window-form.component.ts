import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    template: `
    <h2 mat-dialog-title>Window</h2>

    <mat-dialog-content>
      <form class="form">
        <mat-form-field appearance="outline">
          <mat-label>Subject</mat-label>
          <input matInput id="subject" type="text" data-testid="window-subject-input">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Text</mat-label>
          <textarea matInput id="text" rows="4"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-flat-button type="button" color="primary" (click)="close()">
        Close Window
      </button>
    </mat-dialog-actions>
  `,
    styleUrls: ['window-form.component.scss'],
    standalone: false
})
export class WindowFormComponent {
  constructor(private readonly dialogRef: MatDialogRef<WindowFormComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
