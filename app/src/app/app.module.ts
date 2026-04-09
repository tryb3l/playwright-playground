/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NgxEchartsModule } from 'ngx-echarts';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbMenuModule,
  NbSidebarModule,
} from '@nebular/theme';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent], imports: [BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    AuthModule,
    CoreModule.forRoot(),
    ThemeModule.forRoot()], providers: [provideHttpClient(withInterceptorsFromDi()),
    {
      provide: OverlayContainer,
      useClass: OverlayContainer,
    }]
})
export class AppModule {
}
