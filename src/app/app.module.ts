import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

//imported pages
import { Applications } from "./pages/applications";
import { Profile } from "./pages/profile";
import { Inbox } from "./pages/inbox";
import { Dashboard } from "./pages/dashboard";

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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    ...Dashboard,
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
    HomePage,
    TabsPage,
    ...Dashboard,
    ...Inbox,
    ...Profile,
    ...Applications,
    ...Components
  ],
  providers: [
    ...NativeModules,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ...Providers
  ]
})
export class AppModule {}
