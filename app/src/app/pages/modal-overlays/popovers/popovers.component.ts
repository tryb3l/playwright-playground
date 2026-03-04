import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  NgxPopoverCardComponent,
  NgxPopoverFormComponent,
  NgxPopoverTabsComponent,
} from './popover-examples.component';

@Component({
  selector: 'ngx-popovers',
  styleUrls: ['./popovers.component.scss'],
  templateUrl: './popovers.component.html',
  standalone: false,
})
export class PopoversComponent {
  constructor(private dialog: MatDialog) {}

  demoButtons = Array.from({ length: 12 });
  tabsComponent = NgxPopoverTabsComponent;
  cardComponent = NgxPopoverCardComponent;
  formComponent = NgxPopoverFormComponent;

  openPopoverComponent(component: any) {
    this.dialog.open(component, {
      autoFocus: false,
    });
  }
}
