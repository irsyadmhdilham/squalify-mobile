import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DashboardPage } from "../pages/dashboard/dashboard";
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ApplicationsPage } from "../pages/applications/applications";
import { InboxPage } from "../pages/inbox/inbox";
import { ProfilePage } from "../pages/profile/profile";

import { DirectivesModule } from "../directives/directives.module";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    DashboardPage,
    HomePage,
    TabsPage,
    ApplicationsPage,
    InboxPage
  ],
  imports: [
    BrowserModule,
    DirectivesModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    DashboardPage,
    HomePage,
    TabsPage,
    ApplicationsPage,
    InboxPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
