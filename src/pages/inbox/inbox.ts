import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Store, select } from "@ngrx/store";

import { InboxComposeComponent } from "../../components/inbox/inbox-compose/inbox-compose";
import { CreateGroupchatComponent } from "../../components/inbox/create-groupchat/create-groupchat";
import { InboxProvider } from "../../providers/inbox/inbox";

import { inbox, message, groupInbox } from "../../models/inbox";
import { member } from "../../models/agency";
import { store } from "../../models/store";

import { ChatroomPage } from "./chatroom/chatroom";
import { GroupChatroomPage } from "./group-chatroom/group-chatroom";
import { NotificationsPage } from "../notifications/notifications";

@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  inboxes: inbox[] = [];
  agencyChat: groupInbox;
  groupChat: groupInbox;
  uplineGroupChat: groupInbox;
  pageStatus: string;
  navToChatroom = false;
  listenNewInbox: (inbox: inbox, pk: number) => void;
  listenNewMessage: (message: message, pk: number) => void;
  listenClearUnread: (pk: number) => void;
  newMessageListener: Subscription;
  newInboxListener: Subscription;
  newGroupMessageListener: Subscription;
  storeListener: Subscription;
  notifications$ = this.store.pipe(select('notifications'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private inboxProvider: InboxProvider,
    private events: Events,
    private store: Store<store>
  ) { }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  avatarImage(inbox: inbox) {
    let image: string;
    if (inbox.group_chat) {
      image = inbox.group_chat.group_image;
    } else {
      image = inbox.chat_with.profile_image;
    }
    if (image) {
      return {
        background: `url('${image}') center center no-repeat / cover`
      };
    }
    return false;
  }

  groupImage(obj: groupInbox) {
    if (obj) {
      let url = obj.created_by.profile_image;
      if (obj.role === 'agency') {
        url = obj.agency.agency_image;
      }
      return {
        background: `url('${url}') center center no-repeat / cover`
      };
    }
    return false;
  }

  groupUnread(obj: groupInbox) {
    if (obj) {
      return obj.unread;
    }
    return false;
  }

  toChatroom(inbox: inbox, composeNew?: member) {
    this.navToChatroom = true;
    if (composeNew) {
      this.navCtrl.push(ChatroomPage, { inbox: null, composeNew });
      return;
    }
    if (inbox.chat_with) {
      this.navCtrl.push(ChatroomPage, { inbox });
    } else {
      this.toGroupChatroom(inbox);
    }
  }

  toGroupChatroom(inbox: inbox) {
    this.navToChatroom = true;
    this.navCtrl.push(GroupChatroomPage, { inbox });
  }

  createGroup() {
    const modal = this.modalCtrl.create(CreateGroupchatComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.pageStatus = 'loading';
        setTimeout(() => {
          this.pageStatus = undefined;
        }, 300);
        this.inboxes.unshift(data);
      }
    });
  }

  composeChat() {
    const modal = this.modalCtrl.create(InboxComposeComponent);
    modal.present();
    modal.onDidDismiss((profile: member) => {
      if (profile) {
        const inbox = this.inboxes.find(val => {
          if (val.chat_with) {
            return val.chat_with.pk === profile.pk;
          }
          return false;
        });
        if (inbox) {
          this.toChatroom(inbox);
        } else {
          this.toChatroom(null, profile);
        }
      }
    });
  }

  getInbox() {
    this.pageStatus = 'loading';
    this.inboxProvider.getInbox().subscribe(inboxes => {
      this.pageStatus = undefined;
      this.inboxes = inboxes;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  lastMessage(inbox: inbox) {
    const len = inbox.messages.length;
    if (len > 0) {
      return inbox.messages[len - 1].text;
    }
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
      this.newMessageListener.unsubscribe();
      this.newInboxListener.unsubscribe();
      this.newGroupMessageListener.unsubscribe();
      if (this.storeListener) {
        this.storeListener.unsubscribe();
      }
    }
  }

  listenWsEvents() {
    this.newInboxListener = this.inboxProvider.newInbox$.subscribe(inbox => {
      this.inboxes.unshift(inbox);
    });

    this.newMessageListener = this.inboxProvider.newMessage$.subscribe(response => {
      const i = this.inboxes.findIndex(val => val.pk === response.pk);
      const inbox = this.inboxes[i];
      inbox.messages.push(response.message);
      inbox.unread++;
      const splicedInbox = this.inboxes.splice(i, 1);
      this.inboxes.unshift(splicedInbox[0]);
    });

    this.newGroupMessageListener = this.inboxProvider.newGroupMessage$.subscribe(response => {
      const i = this.inboxes.findIndex(val => val.group_chat.pk === response.groupChatId);
      const inbox = this.inboxes[i];
      inbox.messages.push(response.message);
      inbox.unread++;
      const splicedInbox = this.inboxes.splice(i, 1);
      this.inboxes.unshift(splicedInbox[0]);
    });
  }

}
