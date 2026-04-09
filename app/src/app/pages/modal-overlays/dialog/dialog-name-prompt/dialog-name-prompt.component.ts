import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-name-prompt.component.html',
  styleUrls: ['dialog-name-prompt.component.scss'],
  standalone: false
})
export class DialogNamePromptComponent {
  name = '';

  constructor(private readonly ref: MatDialogRef<DialogNamePromptComponent>) { }

  cancel(): void {
    this.ref.close();
  }

  submit(name: string): void {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    this.ref.close(trimmedName);
  }
}
