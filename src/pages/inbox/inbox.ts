import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import * as socketio from "socket.io-client";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { Subscription } from "rxjs/Subscription";

import { InboxComposeComponent } from "../../components/inbox/inbox-compose/inbox-compose";
import { InboxProvider } from "../../providers/inbox/inbox";

import { inbox, message } from "../../models/inbox";
import { profile } from "../../models/profile";
import { member } from "../../models/agency";
import { ChatroomPage } from "./chatroom/chatroom";

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  inboxes: inbox[] = [];
  agencyChat;
  pageStatus: string;
  navToChatroom = false;
  listenNewInbox: (inbox: inbox, pk: number) => void;
  listenNewMessage: (message: message, pk: number) => void;
  listenClearUnread: (pk: number) => void;
  storeListener: Subscription;
  io = socketio(this.inboxProvider.wsBaseUrl('chat'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private inboxProvider: InboxProvider,
    private events: Events,
    private store: Store<profile>
  ) { }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  groupImage(obj) {
    if (obj) {
      const image = obj.group_chat.owner.profile_image;
      return {
        background: `url('${image}') center center no-repeat / cover`
      };
    }
    return false;
  }

  toChatroom(chatType: string, inbox: inbox, composeNew?: member) {
    this.navToChatroom = true;
    this.navCtrl.push(ChatroomPage, { inbox, composeNew, chatType });
  }

  composeChat() {
    const modal = this.modalCtrl.create(InboxComposeComponent);
    modal.present();
    modal.onDidDismiss((profile: member) => {
      if (profile) {
        const inbox = this.inboxes.find(val => val.chat_with.pk === profile.pk);
        if (inbox) {
          this.toChatroom('personal', inbox);
        } else {
          this.toChatroom('personal', null, profile);
        }
      }
    });
  }

  getInbox() {
    this.pageStatus = 'loading';
    this.inboxProvider.getInbox().subscribe(response => {
      this.pageStatus = undefined;
      const inboxes = response.filter(val => val.group_chat.length === 0);
      const getAgencyChat = response.filter(val => {
        return val.group_chat.length > 0 && val.group_chat.filter(value => value.role === 'agency');
      });
      if (getAgencyChat.length > 0) {
        const agencyChat = getAgencyChat.map(val => {
          return {
            pk: val.pk,
            group_chat: val.group_chat[0],
            unread: val.unread
          };
        });
        this.agencyChat = agencyChat[0];
      }
      this.inboxes = inboxes;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  lastMessage(messages: message[]) {
    const len = messages.length;
    return messages[len - 1].text;
  }

  eventsListener() {
    this.listenNewInbox = (inbox: inbox) => {
      this.inboxes.unshift(inbox);
    };
  
    this.listenNewMessage = (message: message, pk: number) => { 
      const i = this.inboxes.findIndex(val => val.pk === pk);
      this.inboxes[i].messages.push(message);
      const inbox = this.inboxes.splice(i, 1);
      this.inboxes.unshift(inbox[0]);
    };
  
    this.listenClearUnread = (pk: number) => {
      const i = this.inboxes.findIndex(val => val.pk === pk);
      this.inboxes[i].unread = 0;
    };
    this.events.subscribe('inbox: new inbox', this.listenNewInbox);
    this.events.subscribe('inbox: new message', this.listenNewMessage);
    this.events.subscribe('inbox: clear unread', this.listenClearUnread);
  }

  ionViewWillEnter() {
    if (!this.navToChatroom) {
      this.getInbox();
      this.listenWsEvents();
    }
    this.navToChatroom = this.navParams.get('fromChatroom');
    this.eventsListener();
  }

  ionViewWillLeave() {
    if (!this.navToChatroom) {
      this.events.unsubscribe('inbox: new inbox', this.listenNewInbox);
      this.events.unsubscribe('inbox: new message', this.listenNewMessage);
      this.events.unsubscribe('inbox: clear unread', this.listenClearUnread);
      if (this.storeListener) {
        this.storeListener.unsubscribe();
      }
      this.io.close();
    }
  }

  listenWsEvents() {
    this.io.on('connect', () => {
      this.storeListener = (this.store.pipe(select('profile')) as Observable<profile>)
      .subscribe(async profile => {
        const userId = await this.inboxProvider.userId().toPromise();
        const namespace = `${profile.agency.company}:${profile.agency.pk}:${userId}`;
        this.io.on(`${namespace}:new inbox`, (inbox: inbox) => {
          this.inboxes.unshift(inbox);
        });
  
        this.io.on(`${namespace}:new message`, (res: { pk: number; message: message; }) => {
          const i = this.inboxes.findIndex(val => val.pk === res.pk);
          const inbox = this.inboxes[i];
          inbox.messages.push(res.message);
          inbox.unread++;
          const splicedInbox = this.inboxes.splice(i, 1);
          this.inboxes.unshift(splicedInbox[0]);
        });
      });
    });
  }

}
