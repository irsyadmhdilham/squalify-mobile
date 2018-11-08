import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DashboardPage } from "../pages/dashboard/dashboard";
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

//imported pages
import { Applications } from "./pages/applications";
import { Profile } from "./pages/profile";
import { Inbox } from "./pages/inbox";

//imported modules
import { DirectivesModule } from "../directives/directives.module";
import { ComponentsModule } from "../components/components.module";
import { PipesModule } from "../pipes/pipes.module";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//imported components
import { Components } from "../components/components";

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    HomePage,
    TabsPage,
    ...Inbox,
    ...Profile,
    ...Applications,
    ...Components
  ],
  imports: [
    BrowserModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    DashboardPage,
    ...Inbox,
    ...Profile,
    ...Applications,
    ...Components
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
