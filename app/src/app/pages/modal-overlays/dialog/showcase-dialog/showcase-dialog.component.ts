import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ShowcaseDialogData {
  title: string;
}

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
  standalone: false
})
export class ShowcaseDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: ShowcaseDialogData,
    private readonly ref: MatDialogRef<ShowcaseDialogComponent>,
  ) { }

  dismiss(): void {
    this.ref.close();
  }
}
