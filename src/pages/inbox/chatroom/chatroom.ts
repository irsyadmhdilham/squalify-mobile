import { Component, ViewChild } from '@angular/core';
import { NgModel } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { IonicPage, NavController, NavParams, Content, Keyboard } from 'ionic-angular';

import { InboxProvider } from "../../../providers/inbox/inbox";
import { chat } from "../../../interfaces/inbox";
import { member } from "../../../interfaces/agency";

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {

  @ViewChild(Content) content: Content;
  pk: number;
  userId: number | boolean;
  receiverId: number;
  profileImage: string;
  title: string;
  messages = [];
  keyboardDidShow: Subscription;
  text = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private inboxProvider: InboxProvider
  ) { }

  initializer() {
    const chat: chat = this.navParams.get('chat');
    const newChat: member = this.navParams.get('newChat');
    if (newChat) {
      this.title = newChat.name;
      this.profileImage = newChat.profile_image;
      this.receiverId = newChat.pk;
    } else {
      this.pk = chat.pk;
      this.getChat();
    }
  }

  ionViewDidLoad() {
    this.initializer();
    this.keyboardDidShow = this.keyboard.didShow.subscribe(() => {
      this.content.scrollToBottom();
    });
    this.inboxProvider.userId().subscribe(userId => this.userId = userId);
  }

  ionViewWillLeave() {
    this.keyboardDidShow.unsubscribe();
  }

  titleImage() {
    return {
      background: `url('${this.profileImage}') center center no-repeat / cover`
    };
  }

  dateShow(senderId, index) {
    const msg = this.messages[index],
          upper = this.messages[index - 1];
    const msgYear = msg.date.getFullYear(),
          msgMonth = msg.date.getMonth(),
          msgDate = msg.date.getDate(),
          msgHours = msg.date.getHours(),
          msgMinutes = msg.date.getMinutes();
    if (upper) {
      const upperYear = upper.date.getFullYear(),
            upperMonth = upper.date.getMonth(),
            upperDate = upper.date.getDate(),
            upperHours = upper.date.getHours(),
            upperMinutes = upper.date.getMinutes();
      if (upper.senderId === senderId) {
        if (msgYear === upperYear && msgMonth === upperMonth && msgDate === upperDate && msgHours === upperHours && msgMinutes === upperMinutes) {
          return false;
        }
      } 
    }
    return true;
  }

  avatarShow(senderId, index) {
    const below = this.messages[index + 1];
    if (below) {
      if (below.senderId === senderId) {
        return true;
      }
    }
    return false;
  }

  rowStyle(senderId, i) {
    return {
      justifyContent: senderId === this.userId ? 'flex-end' : false,
      marginBottom: this.avatarShow(senderId, i) && this.dateShow(senderId, i) ? '0.3em': false
    }
  }

  getChat() {
    this.inboxProvider.getChat(this.pk).subscribe(chat => {
      this.messages = chat.messages;
      if (chat.chat_type === 'Personal') {
        this.profileImage = chat.composed_by.profile_image;
        this.title = chat.composed_by.name;
      } else {
        this.title = chat.group_name;
      }
    });
  }

  sendMessage(msg: NgModel) {
    if (msg.dirty) {
      const data = {
        text: msg.value,
        receiverId: this.receiverId
      };
      if (!this.pk) {
        this.inboxProvider.createInbox(data).subscribe(inbox => {
          this.pk = inbox.chat.pk;
          this.text = '';
        });
      } else {
        this.inboxProvider.sendMessage(this.pk, data).subscribe(chat => {
          console.log('sent message' ,chat);
        });
      }
    }
  }

}
