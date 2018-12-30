import { Component } from '@angular/core';
import { Events, Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Firebase } from "@ionic-native/firebase";
import { Store, select } from "@ngrx/store";
import * as socketio from "socket.io-client";
import { Observable } from "rxjs";

import { DashboardPage } from "../dashboard/dashboard";
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { ApplicationsPage } from "../applications/applications";
import { InboxPage } from "../inbox/inbox";

import { ApiUrlModules } from "../../functions/config";
import { InboxProvider, newMessage, newGroupMessage } from "../../providers/inbox/inbox";
import { PostProvider, commentPost, likePost, unlikePost } from "../../providers/post/post";
import { profile } from "../../models/profile";
import { store } from "../../models/store";
import { inbox } from "../../models/inbox";

import { Fetch } from "../../store/actions/profile.action";
import { Init as NotifInit, Increment } from "../../store/actions/notifications.action";
import { SocketioInit } from "../../store/actions/socketio.action";

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
  profile$: Observable<profile> = this.store.pipe(select('profile'));

  constructor(
    public storage: Storage,
    private events: Events,
    private platform: Platform,
    private firebase: Firebase,
    private store: Store<store>,
    private inboxProvider: InboxProvider,
    private postProvider: PostProvider
  ) {
    super(storage);
  }

  signIn(value) {
    this.signedIn = value;
  }

  ionViewDidLoad() {
    this.onOpenNotification();
    this.events.subscribe('sign out', data => {
      this.signedIn = data;
    });
    this.userId().subscribe(userId => {
      if (userId) {
        this.signedIn = true;
        this.store.dispatch(new Fetch());
        this.store.dispatch(new NotifInit());
      }
    });
    this.listenWsEvents();
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

  listenWsEvents() {
    this.profile$.subscribe(profile =>{
      const agency = profile.agency;
      if (agency.pk !== 0) {
        let company = agency.company;
        if (company === 'CWA') {
          company = 'cwa';
        } else if (company === 'Public Mutual') {
          company = 'public-mutual';
        }
        const io = socketio.connect(this.wsBaseUrl(company));
        this.store.dispatch(new SocketioInit(io));
        this.chatSocket(io, profile);
        this.postSocket(io, profile);
      }
    });
  }

  chatSocket(io, profile: profile) {
    const namespace = `agency(${profile.agency.pk}):user(${profile.pk})`;
    io.on(`${namespace}:chat:new message`, (data: newMessage) => {
      this.inboxProvider.newMessage$.next(data);
    });

    io.on(`${namespace}:chat:new inbox`, (data: inbox) => {
      this.inboxProvider.newInbox$.next(data);
    });

    io.on(`${namespace}:chat:new group message`, (data: newGroupMessage) => {
      this.inboxProvider.newGroupMessage$.next(data);
    });

    io.on(`${namespace}:notifications`, () => {
      this.store.dispatch(new Increment());
    });
  }

  postSocket(io, profile: profile) {
    const namespace = `agency(${profile.agency.pk})`;
    io.on(`${namespace}:post:new post`, () => {
      this.postProvider.newPost$.next(true);
    });

    io.on(`${namespace}:post:comment post`, (data: commentPost) => {
      this.postProvider.commentPost$.next(data);
    });

    io.on(`${namespace}:post:like post`, (data: likePost) => {
      this.postProvider.likePost$.next(data);
    });

    io.on(`${namespace}:post:unlike post`, (data: unlikePost) => {
      this.postProvider.unlikePost$.next(data);
    });
  }

}
