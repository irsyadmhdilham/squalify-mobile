import { Component, ViewChild } from '@angular/core';
import { NgModel } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Subscription } from "rxjs/Subscription";
import { map } from "rxjs/operators";
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  Keyboard,
  Platform,
  Events
} from 'ionic-angular';
import { NativeAudio } from "@ionic-native/native-audio";
import { Observable } from "rxjs";

import { InboxProvider } from "../../../providers/inbox/inbox";
import { NotificationProvider } from "../../../providers/notification/notification";
import { Decrement } from "../../../store/actions/notifications.action";

import { member } from "../../../models/agency";
import { profile } from "../../../models/profile";
import { store } from "../../../models/store";
import { inbox, message } from "../../../models/inbox";
import { notification } from "../../../models/notification";

@IonicPage()
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
  ioListener: Subscription;
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
    private platform: Platform,
    private nativeAudio: NativeAudio,
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
          this.store.dispatch(new Decrement());
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
    this.registerSound();
    this.clearUnread();
    this.clearNotifRead();
    this.listenIncomingMessage();
  }

  ionViewWillEnter() {
    this.storeListener = (this.store.pipe(select('profile')) as Observable<profile>)
    .subscribe(profile => {
      this.profile = profile;
    });

    this.ioListener = (this.store.pipe(select('io')) as Observable<any>)
    .subscribe(io => {
      this.io = io;
    });
  }

  ionViewWillLeave() {
    this.keyboardDidShow.unsubscribe();
    this.storeListener.unsubscribe();
    this.ioListener.unsubscribe();
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

  sendMessage(msg: NgModel) {
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
    if (msg.touched && msg.value.length > 0) {
      const data = {
        text: msg.value,
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
          this.playSound('submitMessage');
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
          this.playSound('submitMessage');
          receiverResponse(response);
          scrollContent();
        });
      }
    }
  }

  registerSound() {
    this.platform.ready().then(async () => {
      const isCordova = await this.platform.is('cordova');
      if (isCordova) {
        this.nativeAudio.preloadSimple('incomingMessage', '../../../assets/sound/water-drop.mp3');
        this.nativeAudio.preloadSimple('submitMessage', '../../../assets/sound/blob.mp3');
      }
    });
  }

  playSound(action) {
    this.platform.ready().then(async () => {
      const isCordova = await this.platform.is('cordova');
      if (isCordova) {
        if (action === 'incoming message') {
          this.nativeAudio.play('incomingMessage');
        } else {
          this.nativeAudio.play('submitMessage');
        }
      }
    });
  }

}
