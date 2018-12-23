import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from "@ionic-native/firebase";

import { TabsPage } from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private firebase: Firebase
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      const cordova = this.platform.is('cordova');
      if (cordova) {
        // this.grantNotificationPermission();
      }
    });
  }

  async grantNotificationPermission() {
    const hasPerm = await this.firebase.hasPermission();
    if (!hasPerm) {
      const isIOS = this.platform.is('ios');
      if (isIOS) {
        this.firebase.grantPermission();
      }
    }
  }

}
