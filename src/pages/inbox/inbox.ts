import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { InboxComposeComponent } from "../../components/inbox/inbox-compose/inbox-compose";

import { chat } from "../../interfaces/chat";
import { member } from "../../interfaces/agency";
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
  ) { }

  toChatroom(id, name, image) {
    this.navCtrl.push(ChatroomPage, { id, name, image });
  }

  composeChat() {
    const modal = this.modalCtrl.create(InboxComposeComponent);
    modal.present();
    modal.onDidDismiss((data: member) => {
      this.toChatroom(data.pk, data.name, data.profile_image);
    });
  }

}
