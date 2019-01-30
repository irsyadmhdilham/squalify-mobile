import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  Content,
  Events,
  Keyboard
} from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { InboxProvider } from "../../../providers/inbox/inbox";
import { NotificationProvider } from "../../../providers/notification/notification";

import { groupInbox, message } from "../../../models/inbox";
import { profile } from "../../../models/profile";
import { store } from "../../../models/store";
import { notification } from "../../../models/notification";

@Component({
  selector: 'page-group-chatroom',
  templateUrl: 'group-chatroom.html',
})
export class GroupChatroomPage {

  @ViewChild(Content) content: Content;
  inbox: groupInbox = this.navParams.get('inbox');
  inboxId: number;
  pk: number;
  role: string;
  userId: number | boolean;
  profileImage: string;
  title: string;
  subTitle: string;
  messages: message[] = [];
  keyboardDidShow: Subscription;
  storeListener: Subscription;
  newMessageListener: Subscription;
  io: any;
  profile: profile;
  text = '';
  initialSend = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private inboxProvider: InboxProvider,
    private notificationProvider: NotificationProvider,
    private events: Events,
    private keyboard: Keyboard,
    private store: Store<store>
  ) { }

  initializer() {
    this.inboxId = this.inbox.pk;
    this.pk = this.inbox.groupId;
    this.getInbox();
  }

  clearNotifRead() {
    const notif: notification = this.navParams.get('notif');
    if (notif) {
      if (!notif.read) {
        this.notificationProvider.read(notif.pk).subscribe(() => {
          this.events.publish('notifications: read', notif.pk);
        });
      }
    }
  }

  clearUnread() {
    if (this.inbox.unread > 0) {
      this.inboxProvider.clearUnread(this.inboxId).subscribe(() => {
        let topic = 'inbox: clear unread';
        const notif = this.navParams.get('notif');
        if (!notif) {
          this.events.publish(topic, this.inboxId);
        }
      });
    }
  }

  listenIncomingMessage() {
    this.newMessageListener = this.inboxProvider.newGroupMessage$.subscribe(data => {
      if (this.pk === data.groupChatId) {
        const message: message = {
          ...data.message,
          timestamp: new Date(data.message.timestamp)
        };
        this.messages.push(message);
        this.inboxProvider.clearUnread(this.inboxId).subscribe(() => {
          let topic = 'inbox: clear unread';
          this.events.publish(topic, this.inboxId);
        });
        setTimeout(() => {
          this.content.scrollToBottom();
        }, 100);
      }
    });
  }

  ionViewDidLoad() {
    this.initializer();
    this.keyboardDidShow = this.keyboard.didShow.subscribe(() => {
      this.content.scrollToBottom();
    });
    this.inboxProvider.userId().subscribe(userId => this.userId = userId);
    this.clearUnread();
    this.clearNotifRead();
    this.listenIncomingMessage();
  }

  ionViewWillEnter() {
    this.storeListener = this.store.subscribe(store => {
      this.profile = store.profile;
      this.io = store.io;
    });
  }

  ionViewWillLeave() {
    this.keyboardDidShow.unsubscribe();
    this.storeListener.unsubscribe();
    this.newMessageListener.unsubscribe();
    this.navCtrl.getPrevious().data.fromChatroom = false;
    this.navCtrl.getPrevious().data.fromNotifDetail = false;
  }

  titleImage() {
    if (!this.profileImage) {
      return false;
    }
    return {
      background: `url('${this.profileImage}') center center no-repeat / cover`
    };
  }

  dateShow(senderId, index) {
    const msg = this.messages[index],
          upper = this.messages[index - 1];
    const msgYear = msg.timestamp.getFullYear(),
          msgMonth = msg.timestamp.getMonth(),
          msgDate = msg.timestamp.getDate(),
          msgHours = msg.timestamp.getHours(),
          msgMinutes = msg.timestamp.getMinutes();
    if (upper) {
      const upperYear = upper.timestamp.getFullYear(),
            upperMonth = upper.timestamp.getMonth(),
            upperDate = upper.timestamp.getDate(),
            upperHours = upper.timestamp.getHours(),
            upperMinutes = upper.timestamp.getMinutes();
      if (upper.person.pk === senderId) {
        if (msgYear === upperYear && msgMonth === upperMonth && msgDate === upperDate && msgHours === upperHours && msgMinutes === upperMinutes) {
          return false;
        }
      } 
    }
    return true;
  }

  avatarShow(below, current) {
    const currentYear = current.timestamp.getFullYear(),
          currentMonth = current.timestamp.getMonth(),
          currentDate = current.timestamp.getDate(),
          currentHours = current.timestamp.getHours(),
          currentMinutes = current.timestamp.getMinutes();
    if (below) {
      const belowYear = below.timestamp.getFullYear(),
            belowMonth = below.timestamp.getMonth(),
            belowDate = below.timestamp.getDate(),
            belowHours = below.timestamp.getHours(),
            belowMinutes = below.timestamp.getMinutes();
      const condition = currentYear === belowYear && currentMonth === belowMonth && currentDate === belowDate && currentHours === belowHours && currentMinutes === belowMinutes;
      return condition;
    }
    return false;
  }

  viewProfileImage(message, index) {
    const below = this.messages[index + 1];
    if (!message.person.profile_image) {
      return false;
    }
    const condition = below && below.person.pk === message.person.pk && this.avatarShow(below, message);
    return {
      background: `url('${message.person.profile_image}') center center no-repeat / cover`,
      visibility: condition ? 'hidden' : false
    };
  }

  getInbox() {
    this.inboxProvider.getGroupInboxDetail(this.inboxId).pipe(
      map(inbox => {
        return {
          ...inbox,
          messages: inbox.messages.map(val => ({...val, timestamp: new Date(val.timestamp)}))
        };
    })).subscribe(inbox => {
      this.messages = inbox.messages;
      let image = inbox.group_chat.group_image
      this.profileImage = image;
      this.title = inbox.group_chat.title;
      this.subTitle = `${inbox.group_chat.participants.length} members`;
      setTimeout(() => {
        this.content.scrollToBottom(0);
      }, 100);
    });
  }

  sendMessage() {
    const scrollContent = () => {
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    };
    const valid = this.text.match(/^\s+/);
    if (!valid && this.text.length > 0) {
      const data = {
        text: this.text,
        initialSend: this.initialSend
      };
      this.text = '';
      this.inboxProvider.sendGroupMessage(this.inboxId, data).pipe(
        map(message => {
          return {
            ...message,
            timestamp: new Date(message.timestamp)
          };
        })).subscribe(async message => {
        this.messages.push(message);
        scrollContent();
        const userId = await this.inboxProvider.userId().toPromise();
        const agency = this.profile.agency,
              namespace = `agency(${agency.pk})`;
        const participants = this.inbox.participants.filter(val => val.pk !== userId);
        this.io.emit('chat:new group message', {
          namespace,
          message,
          sender: userId,
          participants,
          groupChatId: this.pk,
          inboxId: this.inboxId,
          initialSend: this.initialSend
        });
        this.initialSend = false;
      });
    }
  }

}
