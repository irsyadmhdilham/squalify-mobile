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

import { EpfCalculatorPage } from "../pages/applications/epf-calculator/epf-calculator";
import { EpfElaborationPage } from "../pages/applications/epf-calculator/epf-elaboration/epf-elaboration";
import { EpfRetirementPlanPage } from "../pages/applications/epf-calculator/epf-retirement-plan/epf-retirement-plan";
import { CashCalculatorPage } from "../pages/applications/cash-calculator/cash-calculator";
import { CashElaborationPage } from "../pages/applications/cash-calculator/cash-elaboration/cash-elaboration";

import { SettingsPage } from "../pages/profile/settings/settings";
import { PushNotificationsPage } from "../pages/profile/settings/push-notifications/push-notifications";

import { DirectivesModule } from "../directives/directives.module";
import { ComponentsModule } from "../components/components.module";
import { PipesModule } from "../pipes/pipes.module";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ChangePasswordComponent } from "../components/change-password/change-password";
import { ChangeEmailComponent } from "../components/change-email/change-email";
import { EditProfileComponent } from "../components/edit-profile/edit-profile";

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    SettingsPage,
    PushNotificationsPage,
    DashboardPage,
    HomePage,
    TabsPage,
    ApplicationsPage,
    EpfCalculatorPage,
    EpfElaborationPage,
    EpfRetirementPlanPage,
    CashCalculatorPage,
    CashElaborationPage,
    InboxPage,
    ChangePasswordComponent,
    ChangeEmailComponent,
    EditProfileComponent
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
    ProfilePage,
    SettingsPage,
    PushNotificationsPage,
    DashboardPage,
    HomePage,
    TabsPage,
    ApplicationsPage,
    EpfCalculatorPage,
    EpfElaborationPage,
    EpfRetirementPlanPage,
    CashCalculatorPage,
    CashElaborationPage,
    InboxPage,
    ChangePasswordComponent,
    ChangeEmailComponent,
    EditProfileComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
