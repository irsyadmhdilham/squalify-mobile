import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Keyboard } from 'ionic-angular';

import { content } from "../../../interfaces/chat";

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {

  @ViewChild(Content) content: Content;
  id: string;
  userId = '1';
  senderImage: string;
  senderName: string;
  chats: content[] = [
    { date: new Date(2018, 10, 8, 13, 47), senderId: '1', text: 'Hello world' },
    { date: new Date(2018, 10, 8, 13, 48), senderId: '2', text: 'Hello world' },
    { date: new Date(2018, 10, 8, 13, 49), senderId: '1', text: 'Hello world' },
    { date: new Date(2018, 10, 8, 13, 49), senderId: '2', text: 'Hello world' },
    { date: new Date(2018, 10, 8, 13, 49), senderId: '2', text: 'Manguk' },
    { date: new Date(2018, 10, 8, 13, 50), senderId: '2', text: 'Hello world' }
  ];
  keyboardDidShow;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private keyboard: Keyboard
  ) { }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.senderName = this.navParams.get('name');
    this.senderImage = this.navParams.get('image');
    this.keyboardDidShow = this.keyboard.didShow.subscribe(() => {
      this.content.scrollToBottom();
    })
  }

  ionViewWillLeave() {
    this.keyboardDidShow.unsubscribe();
  }

  titleImage() {
    return {
      background: `url('${this.senderImage}') center center no-repeat / cover`
    };
  }

  dateShow(senderId, index) {
    const msg = this.chats[index],
          upper = this.chats[index - 1];
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
    const below = this.chats[index + 1];
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

}
