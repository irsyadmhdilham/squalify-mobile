import { Component, ViewChild } from '@angular/core';
import { NgModel } from "@angular/forms";
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

import { InboxProvider } from "../../../providers/inbox/inbox";
import { member } from "../../../interfaces/agency";
import { inbox, message } from "../../../interfaces/inbox";

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {

  @ViewChild(Content) content: Content;
  chatType = this.navParams.get('chatType');
  inbox: inbox = this.navParams.get('inbox');
  pk: number;
  userId: number | boolean;
  receiverId: number;
  profileImage: string;
  title: string;
  designation: string;
  messages: message[] = [];
  keyboardDidShow: Subscription;
  text = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private inboxProvider: InboxProvider,
    private platform: Platform,
    private nativeAudio: NativeAudio,
    private events: Events
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

  clearUnread() {
    if (this.inbox) {
      if (this.inbox.unread > 0) {
        this.inboxProvider.clearUnread(this.inbox.pk).subscribe(() => {
          this.events.publish('inbox: clear unread', this.pk);
        });
      }
    }
  }

  ionViewDidLoad() {
    this.initializer();
    this.keyboardDidShow = this.keyboard.didShow.subscribe(() => {
      this.content.scrollToBottom();
    });
    this.inboxProvider.userId().subscribe(userId => this.userId = userId);
    this.registerSound();
    this.clearUnread();
  }

  ionViewWillLeave() {
    this.keyboardDidShow.unsubscribe();
    this.navCtrl.getPrevious().data.fromChatroom = false;
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
      if (this.chatType === 'personal') {
        this.profileImage = inbox.chat_with.profile_image;
        this.title = inbox.chat_with.name;
        this.designation = inbox.chat_with.designation;
        this.receiverId = inbox.chat_with.pk;
      } else {
        this.title = '';
      }
    });
  }

  sendMessage(msg: NgModel) {
    if (msg.touched && msg.value.length > 0) {
      const data = {
        text: msg.value,
        receiverId: this.receiverId
      };
      this.text = '';
      if (!this.pk) {
        this.inboxProvider.createInbox(data).pipe(
          map(inbox => {
            return {
              ...inbox,
              message: { ...inbox.message, timestamp: new Date(inbox.message.timestamp) }
            }
        })).subscribe(data => {
          this.pk = data.inbox.pk;
          this.messages.push(data.message);
          this.events.publish('inbox: new inbox', data.inbox);
          this.playSound('submitMessage');
        });
      } else {
        this.inboxProvider.sendMessage(this.pk, data).pipe(
          map(msg => ({...msg, timestamp: new Date(msg.timestamp)}))
        ).subscribe(message => {
          this.messages.push(message);
          this.events.publish('inbox: new message', message, this.pk);
          this.playSound('submitMessage');
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
