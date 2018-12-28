import { Component } from '@angular/core';
import { Events, Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";
import { Deeplinks } from "@ionic-native/deeplinks";
import { Store, select } from "@ngrx/store";
import * as socketio from "socket.io-client";
import { Observable } from "rxjs";

import { DashboardPage } from "../dashboard/dashboard";
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { ApplicationsPage } from "../applications/applications";
import { InboxPage } from "../inbox/inbox";

import { ApiUrlModules } from "../../functions/config";
import { profile } from "../../models/profile";
import { store } from "../../models/store";

import { Fetch } from "../../store/actions/profile.action";
import { Init as NotifInit, Increment } from "../../store/actions/notifications.action";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends ApiUrlModules {

  signedIn = false;
  tab1Root = HomePage;
  tab2Root = DashboardPage;
  tab3Root = ApplicationsPage;
  tab4Root = InboxPage;
  tab5Root = ProfilePage;
  io = socketio(this.wsBaseUrl('notifications'));
  profile$: Observable<profile> = this.store.pipe(select('profile'));

  constructor(
    public storage: Storage,
    private events: Events,
    private platform: Platform,
    private firebase: Firebase,
    private deepLinks: Deeplinks,
    private store: Store<store>
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
        this.store.dispatch(new NotifInit());
        this.listenIncomingNotif();
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

  listenIncomingNotif() {
    this.profile$.subscribe(profile =>{
      const namespace = `${profile.agency.company}:${profile.agency.pk}:${profile.pk}`;
      this.io.on(`${namespace}:notifications`, () => {
        this.store.dispatch(new Increment());
      });
    });
  }

}
