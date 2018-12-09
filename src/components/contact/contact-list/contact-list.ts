import { Component } from '@angular/core';
import { AlertController, ViewController } from "ionic-angular";

import { ContactProvider } from "../../../providers/contact/contact";
import { contact } from "../../../interfaces/contact";

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactListComponent {

  pageStatus: string;
  contacts: contact[];

  constructor(
    private contactProvider: ContactProvider,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async fetch() {
    const userId = await this.contactProvider.userId();
    this.pageStatus = 'loading';
    this.contactProvider.getContacts(userId, 'pk,name,contact_no').subscribe(observe => {
      this.pageStatus = undefined;
      this.contacts = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  select(contact: contact) {
    const alert = this.alertCtrl.create({
      title: 'Contact selected',
      subTitle: `You've picked ${contact.name}`,
      buttons: [
        { text: 'Cancel' },
        { text: 'Confirm', handler: () => {
          this.viewCtrl.dismiss(contact);
        }}
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
