import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { InboxComposeComponent } from "../../components/inbox/inbox-compose/inbox-compose";
import { InboxProvider } from "../../providers/inbox/inbox";

import { inbox, chat } from "../../interfaces/inbox";
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private inboxProvider: InboxProvider
  ) { }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  toChatroom(chat: chat, newChat?: member) {
    this.navCtrl.push(ChatroomPage, { chat, newChat});
  }

  composeChat() {
    const modal = this.modalCtrl.create(InboxComposeComponent);
    modal.present();
    modal.onDidDismiss((data: member) => {
      if (data) {
        this.toChatroom(null, data);
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

  ionViewDidLoad() {
    this.getInbox();
  }

}
