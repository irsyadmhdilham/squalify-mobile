import { Component } from '@angular/core';
import { AlertController, ViewController, NavParams, ModalController } from "ionic-angular";

import { ContactProvider } from "../../../providers/contact/contact";
import { contact } from "../../../models/contact";
import { ContactStatus } from "../../../functions/colors";
import { ContactFilterComponent } from "../contact-filter/contact-filter";
import { AddContactComponent } from "../add-contact/add-contact";

interface filterData {
  segment: string;
  contactStatus?: string;
  contactType?: string;
  date?: { from: string; until: string; };
  name: string;
  answered?: string;
}

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactListComponent {

  pageStatus: string;
  contacts: contact[];
  sales = false;
  filterData: filterData;
  notFound: boolean;

  constructor(
    private contactProvider: ContactProvider,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetch() {
    this.pageStatus = 'loading';
    this.contactProvider.getContacts('pk,name,contact_no,status,remark,contact_type').subscribe(observe => {
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

  addContact() {
    const modal = this.modalCtrl.create(AddContactComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.pageStatus = undefined;
        this.notFound = false;
        this.contacts.unshift(data.newContact);
      }
    });
  }

  filter() {
    let data = { segment:'contacts', data: this.filterData };
    const modal = this.modalCtrl.create(ContactFilterComponent, data);
    modal.present();
    modal.onDidDismiss((data: filterData) => {
      if (data) {
        this.filterData = data;
        this.pageStatus = 'loading';
        this.contactProvider.contactFilter(data.contactType, data.contactStatus, data.name).subscribe(contacts => {
          this.pageStatus = undefined;
          if (contacts.length === 0) {
            this.notFound = true;
          } else {
            this.notFound = false;
            this.contacts = contacts;
          }
        }, () => {
          this.pageStatus = undefined;
        });
      }
    });
  }

}
