import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-name-prompt.component.html',
  styleUrls: ['dialog-name-prompt.component.scss'],
  standalone: false,
})
export class DialogNamePromptComponent {
  constructor(private dialogRef: MatDialogRef<DialogNamePromptComponent>) {}

  cancel() {
    this.dialogRef.close();
  }

  submit(name) {
    this.dialogRef.close(name);
  }
}
