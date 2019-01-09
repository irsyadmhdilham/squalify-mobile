import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import * as moment from "moment";

import { notification } from "../../models/notification";
import { NotificationProvider } from "../../providers/notification/notification";

import { ChatroomPage } from "../../pages/inbox/chatroom/chatroom";
import { GroupChatroomPage } from "../../pages/inbox/group-chatroom/group-chatroom";
import { PostDetailPage } from "../../pages/home/post-detail/post-detail";

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

  inboxGroupText(notif: notification) {
    const groupChat = notif.inbox_rel.group_chat;
    if (groupChat.role === 'agency') {
      return 'agency group';
    } else if (groupChat.role === 'group') {
      return 'your group';
    } else {
      return 'upline group';
    }
  }

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
    } else if (notif.notification_type === 'group inbox') {
      this.navCtrl.push(GroupChatroomPage, { inbox: notif.inbox_rel, notif });
    } else if (notif.notification_type === 'like' || notif.notification_type === 'comment') {
      this.navCtrl.push(PostDetailPage, { post: { pk: notif.post_rel }, notif });
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
