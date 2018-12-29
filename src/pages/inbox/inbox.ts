import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";

import { InboxComposeComponent } from "../../components/inbox/inbox-compose/inbox-compose";
import { InboxProvider } from "../../providers/inbox/inbox";

import { inbox, message, groupInbox } from "../../models/inbox";
import { member } from "../../models/agency";

import { ChatroomPage } from "./chatroom/chatroom";
import { GroupChatroomPage } from "./group-chatroom/group-chatroom";

@IonicPage()
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
  listenAgencyClearUnread: (pk: number) => void;
  listenGroupClearUnread: (pk: number) => void;
  listenUplineGroupClearUnread: (pk: number) => void;
  storeListener: Subscription;

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

  groupImage(obj: groupInbox) {
    if (obj) {
      let url = obj.owner.profile_image;
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
    this.navCtrl.push(ChatroomPage, { inbox, composeNew });
  }

  toGroupChatroom(inbox) {
    this.navToChatroom = true;
    this.navCtrl.push(GroupChatroomPage, { inbox });
  }

  composeChat() {
    const modal = this.modalCtrl.create(InboxComposeComponent);
    modal.present();
    modal.onDidDismiss((profile: member) => {
      if (profile) {
        const inbox = this.inboxes.find(val => val.chat_with.pk === profile.pk);
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
    this.inboxProvider.getInbox().subscribe(response => {
      this.pageStatus = undefined;
      const inboxes = response.filter(val => !val.group_chat);
      const getAgencyChat = response.filter(val => {
        if (val.group_chat) {
          return val.group_chat.role === 'agency'
        }
      });
      const getGroupChat = response.filter(val => {
        if (val.group_chat) {
          return val.group_chat.role === 'group';
        }
      });
      const getUplineGroupChat = response.filter(val => {
        if (val.group_chat) {
          return val.group_chat.role === 'upline group';
        }
      });
      const groupChatMapper = (val1, val2) => {
        return {
          pk: val1.pk,
          groupId: val2.pk,
          unread: val1.unread,
          participants: val2.participants,
          owner: val2.owner,
          messages: val2.messages,
          role: val2.role,
          agency: val2.owner.agency
        };
      };
      if (getAgencyChat.length > 0) {
        const agencyChat = getAgencyChat.map(val => {
          const groupChat = val.group_chat;
          return groupChatMapper(val, groupChat);
        });
        this.agencyChat = agencyChat[0];
      }
      if (getGroupChat.length > 0) {
        const groupChat = getGroupChat.map(val => {
          const groupChat = val.group_chat;
          return groupChatMapper(val, groupChat);
        });
        this.groupChat = groupChat[0];
      }
      if (getUplineGroupChat.length > 0) {
        const uplineGroupChat = getUplineGroupChat.map(val => {
          const groupChat = val.group_chat;
          return groupChatMapper(val, groupChat);
        });
        this.uplineGroupChat = uplineGroupChat[0];
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

    this.listenAgencyClearUnread = () => {
      if (this.agencyChat) {
        this.agencyChat.unread = 0;
      }
    };
    this.listenGroupClearUnread = () => {
      if (this.groupChat) {
        this.groupChat.unread = 0;
      }
    };
    this.listenUplineGroupClearUnread = () => {
      if (this.uplineGroupChat) {
        this.uplineGroupChat.unread = 0;
      }
    };
    this.events.subscribe('inbox: new inbox', this.listenNewInbox);
    this.events.subscribe('inbox: new message', this.listenNewMessage);
    this.events.subscribe('inbox: clear unread', this.listenClearUnread);
    this.events.subscribe('inbox: agency clear unread', this.listenAgencyClearUnread);
    this.events.subscribe('inbox: group clear unread', this.listenGroupClearUnread);
    this.events.subscribe('inbox: upline group clear unread', this.listenUplineGroupClearUnread);
  }

  ionViewWillEnter() {
    if (!this.navToChatroom) {
      this.getInbox();
      // this.listenWsEvents();
    }
    this.navToChatroom = this.navParams.get('fromChatroom');
    this.eventsListener();
  }

  ionViewWillLeave() {
    if (!this.navToChatroom) {
      this.events.unsubscribe('inbox: new inbox', this.listenNewInbox);
      this.events.unsubscribe('inbox: new message', this.listenNewMessage);
      this.events.unsubscribe('inbox: clear unread', this.listenClearUnread);
      this.events.unsubscribe('inbox: agency clear unread', this.listenAgencyClearUnread);
      this.events.unsubscribe('inbox: group clear unread', this.listenGroupClearUnread);
      this.events.unsubscribe('inbox: upline group clear unread', this.listenUplineGroupClearUnread);
      if (this.storeListener) {
        this.storeListener.unsubscribe();
      }
    }
  }

  listenWsEvents() {
    this.inboxProvider.newInbox$.subscribe(inbox => {
      this.inboxes.unshift(inbox);
    });

    this.inboxProvider.newMessage$.subscribe(response => {
      const i = this.inboxes.findIndex(val => val.pk === response.pk);
      const inbox = this.inboxes[i];
      inbox.messages.push(response.message);
      inbox.unread++;
      const splicedInbox = this.inboxes.splice(i, 1);
      this.inboxes.unshift(splicedInbox[0]);
    });

    // this.io.on(`${groupNamespace}:new group message`, (data: {sender: number; groupChatId: number;}) => {
    //   if (data.sender !== userId) {
    //     if (this.agencyChat.groupId === data.groupChatId) {
    //         this.agencyChat.unread++;
    //     }
    //     if (this.groupChat) {
    //       if (this.groupChat.groupId === data.groupChatId) {
    //         this.groupChat.unread++;
    //       }
    //     }
    //     if (this.uplineGroupChat) {
    //       if (this.uplineGroupChat.groupId === data.groupChatId) {
    //         this.uplineGroupChat.unread++;
    //       }
    //     }
    //   }
    // });
  }

}
