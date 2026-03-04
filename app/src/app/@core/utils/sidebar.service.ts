import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private toggle$ = new Subject<void>();

  get onToggle(): Observable<void> {
    return this.toggle$.asObservable();
  }

  toggle() {
    this.toggle$.next();
  }
}
