import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { RequestPasswordComponent } from './request-password.component';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  imports: [FormsModule, ThemeModule, AuthRoutingModule],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
  ],
})
export class AuthModule {}
