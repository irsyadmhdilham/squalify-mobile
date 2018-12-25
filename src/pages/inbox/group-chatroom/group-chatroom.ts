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
import { store } from "../../../models/store";

@IonicPage()
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
  profile: Observable<profile>;
  text = '';
  io = socketio(this.inboxProvider.wsBaseUrl('chat'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private inboxProvider: InboxProvider,
    private events: Events,
    private keyboard: Keyboard,
    private store: Store<store>,
    private platform: Platform,
    private nativeAudio: NativeAudio
  ) { }

  initializer() {
    this.inboxId = this.inbox.pk;
    this.pk = this.inbox.groupId;
    this.role = this.inbox.role;
    this.getInbox();
  }

  clearUnread() {
    if (this.inbox) {
      if (this.inbox.unread > 0) {
        this.inboxProvider.clearUnread(this.inboxId).subscribe(() => {
          let topic = 'inbox: agency clear unread';
          if (this.role === 'group') {
            topic = 'inbox: group clear unread'
          } else if (this.role === 'upline group') {
            topic = 'inbox: upline group clear unread'
          }
          this.events.publish(topic, this.inboxId);
        });
      }
    }
  }

  listenIncomingMessage() {
    this.io.on('connect', () => {
      this.storeListener = this.profile.subscribe(profile => {
        const agency = profile.agency;
        let namespace = `${agency.company}:${agency.pk}:${this.inboxId}:new agency message`;
        if (this.role === 'group') {
          namespace = `${agency.company}:${agency.pk}:${this.inboxId}:new group message`;
        } else if (this.role === 'upline group') {
          namespace = `${agency.company}:${agency.pk}:${this.inboxId}:new upline group message`;
        }
        this.io.on(namespace, async (data: {message: message; sender: number;}) => {
          const userId = await this.inboxProvider.userId().toPromise();
          if (userId !== data.sender) {
            const message: message = {
              ...data.message,
              timestamp: new Date(data.message.timestamp)
            };
            this.messages.push(message);
          }
          this.inboxProvider.clearUnread(this.inboxId).subscribe(() => {
            let topic = 'inbox: agency clear unread';
            if (this.role === 'group') {
              topic = 'inbox: group clear unread'
            } else if (this.role === 'upline group') {
              topic = 'inbox: upline group clear unread'
            }
            this.events.publish(topic, this.inboxId);
          });
          setTimeout(() => {
            this.content.scrollToBottom();
          }, 100);
        });
      });
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
    this.profile = this.store.pipe(select('profile'));
    this.listenIncomingMessage();
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
    this.inboxProvider.getGroupInboxDetail(this.inboxId).pipe(
      map(inbox => {
        return {
          ...inbox,
          agency: inbox.owner.agency,
          messages: inbox.messages.map(val => ({...val, timestamp: new Date(val.timestamp)}))
        };
    })).subscribe(groupChat => {
      this.messages = groupChat.messages;
      let image = groupChat.owner.profile_image
      if (this.role === 'agency') {
        image = groupChat.agency.agency_image;
      }
      this.profileImage = image;
      let title: string;
      if (this.role === 'agency') {
        title = 'Your agency';
      } else if (this.role === 'group') {
        title = 'Your group';
      } else {
        title = 'Your upline group';
      }
      this.title = title;
      let subTitle = groupChat.owner.name
      if (this.role === 'agency') {
        subTitle = groupChat.agency.name;
      }
      this.subTitle = subTitle;
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    });
  }

  sendMessage(msg: NgModel) {
    const scrollContent = () => {
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    };
    if (msg.touched && msg.value.length > 0) {
      const data = {
        text: msg.value
      };
      this.text = '';
      this.inboxProvider.sendGroupMessage(this.inboxId, data).pipe(
        map(message => {
          return {
            ...message,
            timestamp: new Date(message.timestamp)
          };
        })).subscribe(message => {
        this.messages.push(message);
        this.playSound('submitMessage');
        scrollContent();
        this.storeListener = this.profile.subscribe(async profile => {
          const userId = await this.inboxProvider.userId().toPromise();
          const agency = profile.agency,
                namespace = `${agency.company}:${agency.pk}:${this.inboxId}`;
          let topic = 'new agency message';
          if (this.role === 'group') {
            topic = 'new group message';
          } else if (this.role === 'upline group') {
            topic = 'new upline group message';
          }
          this.io.emit(topic, { namespace, message, sender: userId });
        });
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
