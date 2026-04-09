import { Component, ViewChild } from '@angular/core';
import { MatDatepicker, MatDateRangePicker } from '@angular/material/datepicker';

@Component({
  selector: 'ngx-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
  standalone: false
})
export class DatepickerComponent {
  @ViewChild('formPicker') formPicker?: MatDatepicker<Date>;
  @ViewChild('rangePicker') rangePicker?: MatDateRangePicker<Date>;
  @ViewChild('minMaxPicker') minMaxPicker?: MatDatepicker<Date>;

  readonly min: Date;
  readonly max: Date;

  formPickerValue = '';
  minMaxPickerValue = '';
  rangePickerValue = '';

  private rangeStart: Date | null = null;
  private rangeEnd: Date | null = null;

  constructor() {
    const today = new Date();
    this.min = this.addDays(today, -5);
    this.max = this.addDays(today, 5);
  }

  openCommonPicker(): void {
    this.formPicker?.open();
  }

  openRangePicker(): void {
    this.rangePicker?.open();
  }

  openMinMaxPicker(): void {
    this.minMaxPicker?.open();
  }

  onCommonDateChange(date: Date | null): void {
    this.formPickerValue = this.formatDate(date);
  }

  onRangeDateChange(boundary: 'start' | 'end', date: Date | null): void {
    if (boundary === 'start') {
      this.rangeStart = date;
      if (!date) {
        this.rangeEnd = null;
      }
    } else {
      this.rangeEnd = date;
    }

    this.rangePickerValue = this.rangeStart && this.rangeEnd
      ? `${this.formatDate(this.rangeStart)} - ${this.formatDate(this.rangeEnd)}`
      : this.formatDate(this.rangeStart);
  }

  onMinMaxDateChange(date: Date | null): void {
    this.minMaxPickerValue = this.formatDate(date);
  }

  private addDays(date: Date, days: number): Date {
    const updatedDate = new Date(date);
    updatedDate.setDate(updatedDate.getDate() + days);
    return updatedDate;
  }

  private formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    const month = date.toLocaleString('default', { month: 'short' });
    return `${month} ${date.getDate()}, ${date.getFullYear()}`;
  }
}
