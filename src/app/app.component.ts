import { Component } from '@angular/core';
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";

import { TabsPage } from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar
  ) {
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        this.statusBar.hide();
      });
    }
  }

}
