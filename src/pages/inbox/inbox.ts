import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';

import { InboxComposeComponent } from "../../components/inbox/inbox-compose/inbox-compose";
import { InboxProvider } from "../../providers/inbox/inbox";

import { inbox, message } from "../../interfaces/inbox";
import { member } from "../../interfaces/agency";
import { ChatroomPage } from "./chatroom/chatroom";

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  inboxes: inbox[] = [];
  pageStatus: string;
  navToChatroom = false;
  listenNewInbox: (inbox: inbox, pk: number) => void;
  listenNewMessage: (message: message, pk: number) => void;
  listenClearUnread: (pk: number) => void;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private inboxProvider: InboxProvider,
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
    this.inboxProvider.getInbox().subscribe(inboxes => {
      this.pageStatus = undefined;
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
    }
    this.navToChatroom = this.navParams.get('fromChatroom');
    this.eventsListener();
  }

  ionViewWillLeave() {
    if (!this.navToChatroom) {
      this.events.unsubscribe('inbox: new inbox', this.listenNewInbox);
      this.events.unsubscribe('inbox: new message', this.listenNewMessage);
      this.events.unsubscribe('inbox: clear unread', this.listenClearUnread);
      this.listenNewInbox = undefined;
      this.listenNewMessage = undefined;
      this.listenClearUnread = undefined;
    }
  }

}
