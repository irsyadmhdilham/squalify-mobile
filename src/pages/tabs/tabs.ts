import { Component } from '@angular/core';
import { Events, Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";
import { Deeplinks } from "@ionic-native/deeplinks";
import { Store } from "@ngrx/store";
import { Fetch } from "../../store/actions/profile.action";

import { DashboardPage } from "../dashboard/dashboard";
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { ApplicationsPage } from "../applications/applications";
import { InboxPage } from "../inbox/inbox";

import { Ids } from "../../functions/config";
import { profile } from "../../models/profile";

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
    private firebase: Firebase,
    private deepLinks: Deeplinks,
    private store: Store<profile>
  ) {
    super(storage);
  }

  ionViewWillLoad() {
    this.userId().subscribe(userId => {
      if (userId) {
        this.signedIn = true;
      }
    });
    this.onOpenNotification();
  }

  signIn(value) {
    this.signedIn = value;
  }

  ionViewDidLoad() {
    this.events.subscribe('sign out', data => {
      this.signedIn = data;
    });
    this.userId().subscribe(userId => {
      if (userId) {
        this.store.dispatch(new Fetch());
      }
    });
  }

  deepLinkHandler() {
    this.platform.ready().then(async () => {
      const isCordova = await this.platform.is('cordova');
      if (isCordova) {
        this.deepLinks.route({
          '/profile': ProfilePage
        }).subscribe(match => {
          console.log(match);
        });
      }
    });
  }

  onOpenNotification() {
    this.platform.ready().then(async () => {
      const isCordova = await this.platform.is('cordova');
      if (isCordova) {
        this.firebase.onNotificationOpen().subscribe(observe => {
          console.log(JSON.stringify(observe));
        });
      }
    });
  }

}
