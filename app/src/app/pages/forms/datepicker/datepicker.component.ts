import { Component } from '@angular/core';
import { NbDateService } from '../../../@core/utils';

@Component({
  selector: 'ngx-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
  standalone: false,
})
export class DatepickerComponent {
  min: Date;
  max: Date;

  constructor() {
    this.min = new Date();
    this.min.setDate(this.min.getDate() - 5);
    this.max = new Date();
    this.max.setDate(this.max.getDate() + 5);
  }
}
