import { Component } from '@angular/core';

@Component({
  selector: 'ngx-popover-tabs',
  template: `
    <mat-tab-group>
      <mat-tab label="What's up?">
        <div class="p-4">Such a wonderful day!</div>
      </mat-tab>
      <mat-tab label="Second Tab">
        <div class="p-4">Indeed!</div>
      </mat-tab>
    </mat-tab-group>
  `,
  standalone: false,
})
export class NgxPopoverTabsComponent {}

@Component({
  selector: 'ngx-popover-form',
  template: `
    <div class="p-4">
      <form>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Recipients" />
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Subject" />
        </div>
        <div class="form-group">
          <textarea class="form-control" placeholder="Message"></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-100">Send</button>
      </form>
    </div>
  `,
  standalone: false,
})
export class NgxPopoverFormComponent {}

@Component({
  selector: 'ngx-popover-card',
  template: `
    <mat-card class="popover-card">
      <mat-card-header> Hello! </mat-card-header>
      <mat-card-content>
        Far far away, behind the word mountains, far from the countries Vokalia
        and Consonantia, there live the blind texts. Separated they live in
        Bookmarksgrove right at the coast of the Semantics, a large language
        ocean.
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        margin: 0;
        max-width: 20rem;
      }
    `,
  ],
  standalone: false,
})
export class NgxPopoverCardComponent {}
