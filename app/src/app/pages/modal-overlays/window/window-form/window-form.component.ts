import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `
    <mat-card>
      <mat-card-header>Compose Message</mat-card-header>
      <mat-card-content>
        <form class="form">
          <label for="subject">Subject:</label>
          <input matInput id="subject" type="text" />

          <label class="text-label" for="text">Text:</label>
          <textarea matInput id="text" rows="5"></textarea>
        </form>
      </mat-card-content>
      <mat-card-footer>
        <button mat-button color="primary" (click)="close()">Close</button>
      </mat-card-footer>
    </mat-card>
  `,
  styleUrls: ['window-form.component.scss'],
  standalone: false,
})
export class WindowFormComponent {
  constructor(private dialogRef: MatDialogRef<WindowFormComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
