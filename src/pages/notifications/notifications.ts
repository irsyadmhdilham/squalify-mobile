import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import * as moment from "moment";

import { notification } from "../../models/notification";
import { NotificationProvider } from "../../providers/notification/notification";

import { ChatroomPage } from "../../pages/inbox/chatroom/chatroom";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notifications: notification[] = [];
  pageStatus: string;
  listenRead: (notifId: number) => void;
  navToDetail = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private notificationProvider: NotificationProvider,
    private events: Events
  ) { }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  async fetch() {
    this.pageStatus = 'loading';
    this.notificationProvider.getNotifications().subscribe(notifications => {
      this.pageStatus = undefined;
      this.notifications = notifications
    }, () => this.pageStatus = 'error');
  }

  readNotif() {
    this.listenRead = (notifId: number) => {
      const i = this.notifications.findIndex(val => val.pk === notifId);
      this.notifications[i].read = true;
    };
    this.events.subscribe('notifications: read', this.listenRead);
  }

  ionViewDidLoad() {
    this.fetch();
    this.readNotif();
  }

  ionViewWillEnter() {
    const fromDetail = this.navParams.get('fromNotifDetail');
    if (fromDetail) {
      this.navToDetail = fromDetail;
    }
  }

  ionViewWillLeave() {
    if (!this.navToDetail) {
      this.events.unsubscribe('notifications: read', this.listenRead);
    }
  }

  timestamp(date) {
    const timestamp = moment(date).fromNow();
    return timestamp;
  }

  navigate(notif: notification) {
    this.navToDetail = true;
    if (notif.notification_type === 'inbox') {
      this.navCtrl.push(ChatroomPage, { inbox: notif.inbox_rel, notif });
    }
  }

  read(notif: notification) {
    if (!notif.read) {
      return {
        background: 'rgba(23, 191, 185, 0.2)'
      }
    }
    return false;
  }

}
