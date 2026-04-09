import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthFormPageComponent } from './auth/auth-form-page.component';
import { AuthLogoutPageComponent } from './auth/auth-logout-page.component';
import { AuthShellComponent } from './auth/auth-shell.component';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: AuthShellComponent,
    children: [
      {
        path: '',
        component: AuthFormPageComponent,
        data: { mode: 'login' },
      },
      {
        path: 'login',
        component: AuthFormPageComponent,
        data: { mode: 'login' },
      },
      {
        path: 'register',
        component: AuthFormPageComponent,
        data: { mode: 'register' },
      },
      {
        path: 'logout',
        component: AuthLogoutPageComponent,
      },
      {
        path: 'request-password',
        component: AuthFormPageComponent,
        data: { mode: 'request-password' },
      },
      {
        path: 'reset-password',
        component: AuthFormPageComponent,
        data: { mode: 'reset-password' },
      },
    ],
  },
  { path: '', redirectTo: 'pages/iot-dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages/iot-dashboard' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
