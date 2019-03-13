import { Component } from '@angular/core';
import { AlertController, ViewController, NavParams } from "ionic-angular";

import { ContactProvider } from "../../../providers/contact/contact";
import { contact } from "../../../models/contact";
import { ContactStatus } from "../../../functions/colors";

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactListComponent {

  pageStatus: string;
  contacts: contact[];
  sales = false;

  constructor(
    private contactProvider: ContactProvider,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetch() {
    this.pageStatus = 'loading';
    this.contactProvider.getContacts('pk,name,contact_no,status,remark').subscribe(observe => {
      this.pageStatus = undefined;
      this.contacts = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  statusStyle(contact: contact) {
    const status = contact.status;
    if (status === 'Call back') {
      return { color: ContactStatus.called, fontWeight: 'bold' };
    } else if (status === 'Appointment secured') {
      return { color: ContactStatus.appointmentSecured, fontWeight: 'bold' };
    } else if (status === 'Rejected') {
      return { color: ContactStatus.rejected, fontWeight: 'bold' };
    } else if (status === 'None') {
      return { color: ContactStatus.none, fontWeight: 'bold' };
    } else if (status === 'Client') {
      return { color: ContactStatus.client, fontWeight: 'bold' };
    }
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
    if (this.navParams.get('sales')) {
      this.sales = true;
    }
    this.fetch();
  }

}
