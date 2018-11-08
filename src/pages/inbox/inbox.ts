import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { InboxComposeComponent } from "../../components/inbox-compose/inbox-compose";

import { chat } from "../../interfaces/chat";
import { ChatroomPage } from "./chatroom/chatroom";

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  chats: chat[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) {
    // this.chats = [
    //   { id: '1', senderImage: '../../assets/imgs/facebook.png', senderName: 'Irsyad Mhd Ilham', unread: 10 },
    //   { id: '2', senderImage: '../../assets/imgs/facebook.png', senderName: 'Irsyad Mhd Ilham', unread: 10 },
    //   { id: '3', senderImage: '../../assets/imgs/facebook.png', senderName: 'Aizul Shah'}
    // ];
  }

  toChatroom(id, name, image) {
    this.navCtrl.push(ChatroomPage, { id, name, image });
  }

  newChat() {
    const modal = this.modalCtrl.create(InboxComposeComponent);
    modal.present();
  }

  ionViewDidLoad() {
//   const chat = this.chats[0];
//   this.navCtrl.push(ChatroomPage, { id: chat.id, name: chat.senderName, image: chat.senderImage });
  }

}
