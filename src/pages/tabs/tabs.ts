import { Component } from '@angular/core';
import { Events, Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";

import { DashboardPage } from "../dashboard/dashboard";
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { ApplicationsPage } from "../applications/applications";
import { InboxPage } from "../inbox/inbox";

import { Ids } from "../../functions/config";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends Ids {

  signedIn = false;
  tab1Root = HomePage;
  tab2Root = DashboardPage;
  tab3Root = ApplicationsPage;
  tab4Root = InboxPage;
  tab5Root = ProfilePage;

  constructor(
    public storage: Storage,
    private events: Events,
    private platform: Platform,
    private firebase: Firebase
  ) {
    super(storage);
  }

  async ionViewWillLoad() {
    const userId = await this.userId();
    if (userId) {
      this.signedIn = true;
    }
  }

  signIn(value) {
    this.signedIn = value;
  }

  async grantNotificationPermission() {
    const isIOS = this.platform.is('ios');
    const checkPerm = await this.firebase.hasPermission();
    if (!checkPerm.isEnabled) {
      if (isIOS) {
        this.firebase.grantPermission();
      }
    }
  }

  onOpenNotification() {
    this.firebase.onNotificationOpen().subscribe(observe => {
      console.log(JSON.stringify(observe));
    });
  }

  ionViewDidLoad() {
    this.events.subscribe('sign out', data => {
      this.signedIn = data;
    });
    this.grantNotificationPermission();
    this.onOpenNotification();
  }

}
