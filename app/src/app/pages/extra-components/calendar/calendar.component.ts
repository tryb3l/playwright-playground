import { Component } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

interface CalendarRange {
  start: Date;
  end: Date;
}

type RangeBoundary = 'start' | 'end';

@Component({
  selector: 'ngx-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  standalone: false
})
export class CalendarComponent {
  date = new Date();
  date2 = new Date();
  range = this.createInitialRange();
  activeRangeBoundary: RangeBoundary = 'end';

  readonly rangeDateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month') {
      return '';
    }

    const classes = [];
    if (this.isWithinRange(cellDate, this.range)) {
      classes.push('calendar-cell--range');
    }

    if (this.isSameDay(cellDate, this.range.start)) {
      classes.push('calendar-cell--range-start');
    }

    if (this.isSameDay(cellDate, this.range.end)) {
      classes.push('calendar-cell--range-end');
    }

    return classes.join(' ');
  };

  readonly customDateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month') {
      return '';
    }

    const classes = [];

    if (cellDate.getDay() === 0 || cellDate.getDay() === 6) {
      classes.push('calendar-cell--weekend');
    }

    if (cellDate.getDate() % 5 === 0) {
      classes.push('calendar-cell--accent');
    }

    if (this.isSameDay(cellDate, this.date2)) {
      classes.push('calendar-cell--custom-selected');
    }

    return classes.join(' ');
  };

  onPrimaryDateChange(date: Date | null): void {
    if (date) {
      this.date = date;
    }
  }

  onRangeDateChange(date: Date | null): void {
    if (!date) {
      return;
    }

    if (this.activeRangeBoundary === 'start') {
      this.range = {
        start: date,
        end: this.isBefore(this.range.end, date) ? date : this.range.end,
      };
      this.activeRangeBoundary = 'end';
      return;
    }

    this.range = {
      start: this.isAfter(this.range.start, date) ? date : this.range.start,
      end: date,
    };
    this.activeRangeBoundary = 'start';
  }

  onCustomDateChange(date: Date | null): void {
    if (date) {
      this.date2 = date;
    }
  }

  setRangeBoundary(boundary: RangeBoundary): void {
    this.activeRangeBoundary = boundary;
  }

  resetRange(): void {
    this.range = this.createInitialRange();
    this.activeRangeBoundary = 'end';
  }

  getCustomCaption(): string {
    return `${(this.date2.getDate() + 100) * this.date2.getDate()}$`;
  }

  private createInitialRange(): CalendarRange {
    const today = new Date();
    return {
      start: this.addDays(this.getMonthStart(today), 3),
      end: this.addDays(this.getMonthEnd(today), -3),
    };
  }

  private getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getMonthEnd(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  private addDays(date: Date, days: number): Date {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  private isWithinRange(date: Date, range: CalendarRange): boolean {
    const value = this.stripTime(date);
    return value >= this.stripTime(range.start) && value <= this.stripTime(range.end);
  }

  private isSameDay(left: Date, right: Date): boolean {
    return this.stripTime(left) === this.stripTime(right);
  }

  private isBefore(left: Date, right: Date): boolean {
    return this.stripTime(left) < this.stripTime(right);
  }

  private isAfter(left: Date, right: Date): boolean {
    return this.stripTime(left) > this.stripTime(right);
  }

  private stripTime(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }
}
