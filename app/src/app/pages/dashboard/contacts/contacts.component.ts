import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { Contacts, RecentUsers, UserData } from '../../../@core/data/users';

type ContactsPanel = 'contacts' | 'recent';

@Component({
    selector: 'ngx-contacts',
    styleUrls: ['./contacts.component.scss'],
    templateUrl: './contacts.component.html',
    standalone: false
})
export class ContactsComponent implements OnDestroy {

  private alive = true;

  contacts: Contacts[] = [];
  recent: RecentUsers[] = [];
  activePanel: ContactsPanel = 'contacts';

  constructor(private userService: UserData) {
    forkJoin(
      this.userService.getContacts(),
      this.userService.getRecentUsers(),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([contacts, recent]: [Contacts[], RecentUsers[]]) => {
        this.contacts = contacts;
        this.recent = recent;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  setActivePanel(panel: ContactsPanel): void {
    this.activePanel = panel;
  }

  getContactRowTestId(name: string): string {
    return `dashboard-contact-row-${name.toLowerCase().split(' ').join('-')}`;
  }
}
