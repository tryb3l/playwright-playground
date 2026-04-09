import { Component } from '@angular/core';
import { LocalDataSource } from 'angular2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
    selector: 'ngx-smart-table',
    templateUrl: './smart-table.component.html',
    styleUrls: ['./smart-table.component.scss'],
    standalone: false
})
export class SmartTableComponent {

  settings = {
    add: {
      addButtonContent: '<i class="fa-solid fa-plus"></i>',
      createButtonContent: '<i class="fa-solid fa-check"></i>',
      cancelButtonContent: '<i class="fa-solid fa-xmark"></i>',
    },
    edit: {
      editButtonContent: '<i class="fa-solid fa-pen"></i>',
      saveButtonContent: '<i class="fa-solid fa-check"></i>',
      cancelButtonContent: '<i class="fa-solid fa-xmark"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa-solid fa-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData) {
    const data = this.service.getData();
    this.source.load(data);
  }

  onDeleteConfirm(event: { confirm: { resolve: () => void; reject: () => void } }): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
