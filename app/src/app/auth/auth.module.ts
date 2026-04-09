import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthFormPageComponent } from './auth-form-page.component';
import { AuthLogoutPageComponent } from './auth-logout-page.component';
import { AuthShellComponent } from './auth-shell.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    declarations: [
        AuthShellComponent,
        AuthFormPageComponent,
        AuthLogoutPageComponent,
    ],
    exports: [
        AuthShellComponent,
        AuthFormPageComponent,
        AuthLogoutPageComponent,
    ],
})
export class AuthModule { }