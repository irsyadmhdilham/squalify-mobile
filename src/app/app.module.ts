import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from "../pages/sign-in/sign-in";

//imported pages
import { Applications } from "./pages/applications";
import { Profile } from "./pages/profile";
import { Inbox } from "./pages/inbox";
import { Dashboard } from "./pages/dashboard";
import { HomePages } from "./pages/home";
import { NotificationsPage } from "../pages/notifications/notifications";

//imported modules
import { DirectivesModule } from "../directives/directives.module";
import { ComponentsModule } from "../components/components.module";
import { PipesModule } from "../pipes/pipes.module";

import { NativeModules } from "./native-modules";
import { IonicStorageModule } from "@ionic/storage";

//imported components
import { Components } from "../components/components";

//providers
import { Providers } from "../providers/providers";

//ngrx modules
import { storeModule } from "./store-module";
import { effectsModule } from "./effects-module";

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SignInPage,
    NotificationsPage,
    ...Dashboard,
    ...Inbox,
    ...Profile,
    ...Applications,
    ...Components,
    ...HomePages
  ],
  imports: [
    BrowserModule,
    storeModule,
    effectsModule,
    DirectivesModule,
    PipesModule,
    ComponentsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: 'db',
      driverOrder: ['indexeddb', 'sqlite', 'localstorage', 'websql'],
      version: 1.0
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SignInPage,
    NotificationsPage,
    ...Dashboard,
    ...Inbox,
    ...Profile,
    ...Applications,
    ...Components,
    ...HomePages
  ],
  providers: [
    ...NativeModules,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ...Providers
  ]
})
export class AppModule {}
