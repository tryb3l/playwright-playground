import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
  standalone: false,
})
export class ShowcaseDialogComponent {
  @Input() title: string;

  constructor(
    private dialogRef: MatDialogRef<ShowcaseDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data?: { title?: string }
  ) {
    if (this.data?.title) {
      this.title = this.data.title;
    }
  }

  dismiss() {
    this.dialogRef.close();
  }
}
