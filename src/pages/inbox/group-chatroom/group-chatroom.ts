import { Component, ViewChild } from '@angular/core';
import { NgModel } from "@angular/forms";
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  Events,
  Keyboard,
  Platform
} from 'ionic-angular';
import { Observable } from "rxjs";
import { Subscription } from "rxjs/Subscription";
import { map } from "rxjs/operators";
import * as socketio from "socket.io-client";
import { Store, select } from "@ngrx/store";
import { NativeAudio } from "@ionic-native/native-audio";

import { InboxProvider } from "../../../providers/inbox/inbox";
import { groupInbox, message } from "../../../models/inbox";
import { profile } from "../../../models/profile";

@IonicPage()
@Component({
  selector: 'page-group-chatroom',
  templateUrl: 'group-chatroom.html',
})
export class GroupChatroomPage {

  @ViewChild(Content) content: Content;
  inbox: groupInbox = this.navParams.get('inbox');
  pk: number;
  userId: number | boolean;
  receiverId: number;
  profileImage: string;
  title: string;
  designation: string;
  messages: message[] = [];
  keyboardDidShow: Subscription;
  storeListener: Subscription;
  profile: Observable<profile>;
  text = '';
  io = socketio(this.inboxProvider.wsBaseUrl('chat'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private inboxProvider: InboxProvider,
    private events: Events,
    private keyboard: Keyboard,
    private store: Store<profile>,
    private platform: Platform,
    private nativeAudio: NativeAudio
  ) { }

  initializer() {
    this.pk = this.inbox.pk;
    this.getInbox();
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

  // listenIncomingMessage() {
  //   this.io.on('connect', () => {
  //     this.storeListener = this.profile.subscribe(async profile => {
  //       const userId = await this.inboxProvider.userId().toPromise();
  //       const namespace = `${profile.agency.company}:${profile.agency.pk}:${userId}:new message`;
  //       this.io.on(namespace, (data: { message: message }) => {
  //         const message: message = {
  //           ...data.message,
  //           timestamp: new Date(data.message.timestamp)
  //         }
  //         this.messages.push(message);
  //         this.inboxProvider.clearUnread(this.pk).subscribe(() => {
  //           this.events.publish('inbox: clear unread', this.pk);
  //         });
  //         setTimeout(() => {
  //           this.content.scrollToBottom();
  //         }, 100);
  //       });
  //     });
  //   });
  // }

  ionViewDidLoad() {
    this.initializer();
    this.keyboardDidShow = this.keyboard.didShow.subscribe(() => {
      this.content.scrollToBottom();
    });
    this.inboxProvider.userId().subscribe(userId => this.userId = userId);
    this.registerSound();
    this.clearUnread();
    this.profile = this.store.pipe(select('profile'));
    // this.listenIncomingMessage();
  }

  ionViewWillLeave() {
    this.keyboardDidShow.unsubscribe();
    if (this.storeListener) {
      this.storeListener.unsubscribe();
    }
    this.navCtrl.getPrevious().data.fromChatroom = false;
    this.io.close();
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
    this.inboxProvider.getGroupInboxDetail(this.pk).pipe(
      map(inbox => {
        return {
          ...inbox,
          messages: inbox.messages.map(val => ({...val, timestamp: new Date(val.timestamp)}))
        };
    })).subscribe(inbox => {
      this.messages = inbox.messages;
      this.profileImage = inbox.owner.profile_image;
      this.title = inbox.owner.name;
      this.designation = inbox.owner.designation;
      this.receiverId = inbox.owner.pk;
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    });
  }

  sendMessage(msg: NgModel) {
    const receiverResponse = data => {
      this.storeListener = this.profile.subscribe(profile => {
        const namespace = `${profile.agency.company}:${profile.agency.pk}:${this.receiverId}`;
        if (data.receiver_update) {
          this.io.emit('new message', { namespace, obj: data.receiver_update });
        }
      });
    };
    const scrollContent = () => {
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    };
    if (msg.touched && msg.value.length > 0) {
      const data = {
        text: msg.value,
        receiverId: this.receiverId
      };
      this.text = '';
      this.inboxProvider.sendGroupMessage(this.pk, data).pipe(
        map(response => {
          return {
            ...response,
            message: { ...response.message, timestamp: new Date(response.message.timestamp) }
          };
        })).subscribe(response => {
        this.messages.push(response.message);
        this.events.publish('inbox: new message', response.message, this.pk);
        this.playSound('submitMessage');
        receiverResponse(response);
        scrollContent();
      });
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
