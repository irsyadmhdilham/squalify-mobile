import { Component } from '@angular/core';
import { Events, Platform, NavController, ModalController } from "ionic-angular";
import * as moment from "moment";
import { Storage } from "@ionic/storage";
import { Network } from "@ionic-native/network";
import { Firebase } from "@ionic-native/firebase";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { LocalNotifications, ILocalNotification } from "@ionic-native/local-notifications";

import { Store, select } from "@ngrx/store";
import * as socketio from "socket.io-client";
import { Observable, Subject } from "rxjs";
import { takeUntil, first } from "rxjs/operators";

import { DashboardPage } from "../dashboard/dashboard";
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { ApplicationsPage } from "../applications/applications";
import { InboxPage } from "../inbox/inbox";
import { ChatroomPage } from "../inbox/chatroom/chatroom";
import { GroupChatroomPage } from "../inbox/group-chatroom/group-chatroom";
import { ScheduleDetailPage } from "../dashboard/schedules/schedule-detail/schedule-detail";
import { MemoDetailPage } from "../home/memo-detail/memo-detail";

import { NoConnectionComponent } from "../../components/no-connection/no-connection";

import { ApiUrlModules } from "../../functions/config";
import { InboxProvider, newMessage, newGroupMessage } from "../../providers/inbox/inbox";
import { PostProvider, commentPost, likePost, unlikePost } from "../../providers/post/post";
import { PointProvider } from "../../providers/point/point";
import { SalesProvider } from "../../providers/sales/sales";
import { ScheduleProvider } from "../../providers/schedule/schedule";

import { profile } from "../../models/profile";
import { store } from "../../models/store";
import { inbox } from "../../models/inbox";
import { pointIo } from "../../models/point";
import { salesIo } from "../../models/sales";

import { Fetch } from "../../store/actions/profile.action";
import { Init as NotifInit, Increment } from "../../store/actions/notifications.action";
import { SocketioInit } from "../../store/actions/socketio.action";
import { PointDecrement, PointIncrement } from "../../store/actions/points.action";

import { PostDetailPage } from "../home/post-detail/post-detail";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends ApiUrlModules {

  signedIn: string;
  tab1Root = HomePage;
  tab2Root = DashboardPage;
  tab3Root = ApplicationsPage;
  tab4Root = InboxPage;
  tab5Root = ProfilePage;
  hq = false;

  constructor(
    public storage: Storage,
    private events: Events,
    private platform: Platform,
    private firebase: Firebase,
    private store: Store<store>,
    private inboxProvider: InboxProvider,
    private postProvider: PostProvider,
    private navCtrl: NavController,
    private pointProvider: PointProvider,
    private salesProvider: SalesProvider,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private network: Network,
    private modalCtrl: ModalController,
    private localNotifications: LocalNotifications,
    private scheduleProvider: ScheduleProvider
  ) {
    super(storage);
  }

  signIn(value: string) {
    this.signedIn = value;
    this.statusBarConfig();
    this.grantNotificationPermission();
    this.getScheduleReminders();
    const profileInit$ = new Subject<boolean>(),
          profile$: Observable<profile> = this.store.pipe(select('profile'));
    this.listenWsEvents(profile$, profileInit$);
    this.events.subscribe('this is hq', value => {
      this.hq = value;
      this.storage.set('hq', 'true');
    });
  }

  ionViewWillEnter() {
    this.onOpenNotification();
    this.onLocalNotifications();
  }

  ionViewDidLoad() {
    this.watchConnection();
    this.statusBarConfig(true);
    this.events.subscribe('sign out', data => {
      this.signedIn = data;
      this.hq = false;
    });
    this.splashScreenCtrl();
    this.userId().subscribe(userId => {
      if (userId) {
        this.signedIn = 'signed in';
        this.store.dispatch(new Fetch());
        this.store.dispatch(new NotifInit());
        this.statusBarConfig();
        const profileInit$ = new Subject<boolean>(),
              profile$: Observable<profile> = this.store.pipe(select('profile'));
        this.listenWsEvents(profile$, profileInit$);
        this.storage.get('hq').then(hq => {
          if (hq === 'true') {
            this.hq = true;
          }
        })
      } else {
        this.signedIn = 'not sign in';
      }
    });
  }

  splashScreenCtrl() {
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        this.splashScreen.hide();
      });
    }
  }

  statusBarConfig(light: boolean = false) {
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        this.statusBar.show();
        if (light) {
          this.statusBar.styleLightContent();
        } else {
          this.statusBar.styleDefault();
        }
      });
    }
  }

  onLocalNotifications() {
    const isMobile = this.platform.is('mobile'),
          isCordova = this.platform.is('cordova');
    if (isMobile && isCordova) {
      this.platform.ready().then(() => {
        this.localNotifications.on('click').pipe(first()).subscribe((response: ILocalNotification) => {
          this.navCtrl.push(ScheduleDetailPage, { scheduleId: response.id });
        });
      });
    }
  }

  getScheduleReminders() {
    const isMobile = this.platform.is('mobile'),
          isCordova = this.platform.is('cordova');
    if (isMobile && isCordova) {
      this.platform.ready().then(() => {
        this.scheduleProvider.getReminders().subscribe(schedules => {
          if (schedules.length > 0) {
            const setSchedules = schedules.map(val => {
              const text = moment(val.date).format('ddd, D MMM YYYY, h:mma');
              return {
                id: val.pk,
                title: `Reminder: ${val.title}`,
                text,
                trigger: { at: moment(val.reminder).toDate() }
              }
            });
            this.localNotifications.schedule(setSchedules);
          }
        });
      });
    }
  }

  onOpenNotification() {
    this.platform.ready().then(() => {
      const isCordova = this.platform.is('cordova'),
            isMobile = this.platform.is('mobile');
      if (isCordova && isMobile) {
        this.firebase.onNotificationOpen().pipe(first()).subscribe(observe => {
          const title = observe.title;
          const inboxId = parseInt(observe.inbox_id),
                notifId = parseInt(observe.notif_id),
                memoId = parseInt(observe.memo_id);
          console.log(JSON.stringify(observe));
          if (title === 'like post' || title === 'comment post' || title === 'closed sales') {
            const postId = parseInt(observe.post_id),
                  notifId = parseInt(observe.notif_id);
            this.navCtrl.push(PostDetailPage, {
              post: { pk: postId },
              notif: { pk: notifId, read: false }
            });
          } else if (title === 'personal inbox') {
            this.navCtrl.push(ChatroomPage, {
              inbox: { pk: inboxId, unread: 1 },
              notif: { pk: notifId, read: false }
            });
          } else if (title === 'group inbox') {
            this.navCtrl.push(GroupChatroomPage, {
              inbox: { pk: inboxId, unread: 1 },
              notif: { pk: notifId, read: false }
            });
          } else if (title === 'New memo') {
            this.navCtrl.push(MemoDetailPage, {
              memo: { pk: memoId, unread: 1 },
              notif: { pk: notifId, read: false }
            });
          }
        });
      }
    });
  }

  watchConnection() {
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        this.network.onDisconnect().subscribe(() => {
          const modal = this.modalCtrl.create(NoConnectionComponent);
          modal.present();
        });
      });
    }
  }

  listenWsEvents(profile$: Observable<profile>, profileInit$: Subject<boolean>) {
    profile$.pipe(takeUntil(profileInit$)).subscribe(profile =>{
      const agency = profile.agency;
      if (agency.pk !== 0) {
        let company = agency.company;
        if (company === 'CWA') {
          company = 'cwa';
        } else if (company === 'Public Mutual') {
          company = 'public-mutual';
        }
        const io = socketio.connect(this.wsBaseUrl(company), { transports: ['websocket'] });
        this.store.dispatch(new SocketioInit(io));
        this.chatSocket(io, profile);
        this.postSocket(io, profile);
        this.pointSocket(io, profile);
        this.salesSocket(io, profile);
        profileInit$.next(true);
        profileInit$.unsubscribe();
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
    const namespace = `agency(${profile.agency.pk}):user(${profile.pk})`;
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

  pointSocket(io, profile: profile) {
    const namespace = `agency(${profile.agency.pk}):user(${profile.pk})`;
    io.on(`${namespace}:point:add point`, (data: pointIo) => {
      let group = false;
      if (profile.group) {
        if (profile.pk === data.uplineId) {
          group = true;
        }
      }
      this.store.dispatch(new PointIncrement(data.point, group, false));
      this.pointProvider.addPoint$.next(data);
    });

    io.on(`${namespace}:point:subtract point`, (data: pointIo) => {
      let group = false;
      if (profile.group) {
        if (profile.pk === data.uplineId) {
          group = true;
        }
      }
      this.store.dispatch(new PointDecrement(data.point, group, false));
      this.pointProvider.subtractPoint$.next(data);
    });
  }

  salesSocket(io, profile: profile) {
    const namespace = `agency(${profile.agency.pk}):user(${profile.pk})`;
    io.on(`${namespace}:sales:add sales`, (data: salesIo) => {
      this.salesProvider.addSales$.next(data);
    });
  }

  grantNotificationPermission() {
    this.platform.ready().then(async () => {
      const cordova = this.platform.is('cordova'),
            isIOS = this.platform.is('ios'),
            isMobile = this.platform.is('mobile');
      if (cordova && isIOS && isMobile) {
        const hasPerm = await this.firebase.hasPermission();
        if (!hasPerm.isEnabled) {
          this.firebase.grantPermission();
        }
      }
    });
  }

}
