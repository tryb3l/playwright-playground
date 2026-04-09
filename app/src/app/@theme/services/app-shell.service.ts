import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppShellService {
    private readonly sidebarOpenSubject = new BehaviorSubject(true);

    readonly sidebarOpen$ = this.sidebarOpenSubject.asObservable();

    get sidebarOpen(): boolean {
        return this.sidebarOpenSubject.value;
    }

    toggleSidebar(): void {
        this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
    }

    setSidebarOpen(isOpen: boolean): void {
        this.sidebarOpenSubject.next(isOpen);
    }
}