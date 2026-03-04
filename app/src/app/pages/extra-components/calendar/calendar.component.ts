import { Component } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'ngx-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  standalone: false,
})
export class CalendarComponent {
  date = new Date();
  date2 = new Date();
  range: { start: Date | null; end: Date | null } = {
    start: null,
    end: null,
  };

  readonly rangeDateClass: MatCalendarCellClassFunction<Date> = (
    cellDate,
    view
  ) => {
    if (view !== 'month' || !this.range.start) {
      return '';
    }

    if (!this.range.end) {
      return this.sameDate(cellDate, this.range.start) ? 'range-start' : '';
    }

    const cellTime = this.stripTime(cellDate).getTime();
    const startTime = this.stripTime(this.range.start).getTime();
    const endTime = this.stripTime(this.range.end).getTime();

    if (cellTime === startTime) {
      return 'range-start';
    }

    if (cellTime === endTime) {
      return 'range-end';
    }

    if (cellTime > startTime && cellTime < endTime) {
      return 'range-inner';
    }

    return '';
  };

  readonly weekendDateClass: MatCalendarCellClassFunction<Date> = (
    cellDate,
    view
  ) => {
    if (view !== 'month') {
      return '';
    }
    const day = cellDate.getDay();
    return day === 0 || day === 6 ? 'weekend-date' : '';
  };

  selectRangeDate(date: Date) {
    if (!this.range.start || this.range.end) {
      this.range = { start: date, end: null };
      return;
    }

    if (
      this.stripTime(date).getTime() <
      this.stripTime(this.range.start).getTime()
    ) {
      this.range = { start: date, end: this.range.start };
      return;
    }

    this.range = { start: this.range.start, end: date };
  }

  clearRange() {
    this.range = { start: null, end: null };
  }

  private sameDate(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private stripTime(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
