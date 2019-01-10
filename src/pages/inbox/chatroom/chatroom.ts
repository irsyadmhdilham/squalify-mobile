import { Component, ViewChild } from '@angular/core';
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs/Subscription";
import { map } from "rxjs/operators";
import {
  NavController,
  NavParams,
  Content,
  Keyboard,
  Events
} from 'ionic-angular';

import { InboxProvider } from "../../../providers/inbox/inbox";
import { NotificationProvider } from "../../../providers/notification/notification";

import { member } from "../../../models/agency";
import { profile } from "../../../models/profile";
import { store } from "../../../models/store";
import { inbox, message } from "../../../models/inbox";
import { notification } from "../../../models/notification";

@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {

  @ViewChild(Content) content: Content;
  inbox: inbox = this.navParams.get('inbox');
  pk: number;
  userId: number | boolean;
  receiverId: number;
  profileImage: string;
  title: string;
  designation: string;
  messages: message[] = [];
  keyboardDidShow: Subscription;
  storeListener: Subscription;
  newMessageListener: Subscription;
  profile: profile;
  initialSend = true;
  text = '';
  io: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private inboxProvider: InboxProvider,
    private notificationProvider: NotificationProvider,
    private events: Events,
    private store: Store<store>
  ) { }

  initializer() {
    const composeNew: member = this.navParams.get('composeNew');
    if (composeNew) {
      this.title = composeNew.name;
      this.profileImage = composeNew.profile_image;
      this.receiverId = composeNew.pk;
      this.designation = composeNew.designation;
    } else {
      this.pk = this.inbox.pk;
      this.getInbox();
    }
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
    if (this.inbox) {
      if (this.inbox.unread > 0) {
        this.inboxProvider.clearUnread(this.inbox.pk).subscribe(() => {
          const notif = this.navParams.get('notif');
          if (!notif) {
            this.events.publish('inbox: clear unread', this.pk);
          }
        });
      }
    }
  }

  listenIncomingMessage() {
    this.newMessageListener = this.inboxProvider.newMessage$.subscribe(data => {
      const message: message = {
        ...data.message,
        timestamp: new Date(data.message.timestamp)
      }
      this.messages.push(message);
      this.inboxProvider.clearUnread(this.pk).subscribe(() => {
        this.events.publish('inbox: clear unread', this.pk);
      });
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
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
    this.inboxProvider.getInboxDetail(this.pk).pipe(
      map(inbox => {
        return {
          ...inbox,
          messages: inbox.messages.map(val => ({...val, timestamp: new Date(val.timestamp)}))
        };
    })).subscribe(inbox => {
      this.messages = inbox.messages;
      this.profileImage = inbox.chat_with.profile_image;
      this.title = inbox.chat_with.name;
      this.designation = inbox.chat_with.designation;
      this.receiverId = inbox.chat_with.pk;
      setTimeout(() => {
        this.content.scrollToBottom(0);
      }, 100);
    });
  }

  sendMessage() {
    const receiverResponse = data => {
      const profile = this.profile;
      const namespace = `agency(${profile.agency.pk}):user(${this.receiverId})`;
      if (data.receiver_create) {
        this.io.emit('chat:new inbox', { namespace, inbox: data.receiver_create });
      }
      if (data.receiver_update) {
        this.io.emit('chat:new message', { namespace, obj: data.receiver_update, initialSend: this.initialSend });
      }
    };
    const scrollContent = () => {
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    };
    const valid = this.text.match(/^\s+/);
    if (!valid && this.text.length > 0) {
      const data = {
        text: this.text,
        receiverId: this.receiverId,
        initialSend: this.initialSend
      };
      this.text = '';
      if (!this.pk) {
        this.inboxProvider.createInbox(data).pipe(
          map(response => {
            return {
              ...response,
              message: { ...response.message, timestamp: new Date(response.message.timestamp) }
            }
        })).subscribe(data => {
          receiverResponse(data);
          this.initialSend = false;
          this.pk = data.inbox.pk;
          this.messages.push(data.message);
          this.events.publish('inbox: new inbox', data.inbox);
          scrollContent();
        });
      } else {
        this.inboxProvider.sendMessage(this.pk, data).pipe(
          map(response => {
            return {
              ...response,
              message: { ...response.message, timestamp: new Date(response.message.timestamp) }
            };
          })).subscribe(response => {
          this.initialSend = false;
          this.messages.push(response.message);
          this.events.publish('inbox: new message', response.message, this.pk);
          receiverResponse(response);
          scrollContent();
        });
      }
    }
  }

}
