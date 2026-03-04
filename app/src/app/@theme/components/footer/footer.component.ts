import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by"> Built on ngx-admin layout </span>
    <div class="socials">
      <a href="#" target="_blank" aria-label="GitHub"
        ><mat-icon>code</mat-icon></a
      >
      <a href="#" target="_blank" aria-label="Facebook"
        ><mat-icon>public</mat-icon></a
      >
      <a href="#" target="_blank" aria-label="X"
        ><mat-icon>alternate_email</mat-icon></a
      >
      <a href="#" target="_blank" aria-label="LinkedIn"
        ><mat-icon>business</mat-icon></a
      >
    </div>
  `,
  standalone: false,
})
export class FooterComponent {}
