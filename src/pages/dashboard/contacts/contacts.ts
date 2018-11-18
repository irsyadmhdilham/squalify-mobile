import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { ContactDetailPage } from "./contact-detail/contact-detail";

import { AddContactComponent } from "../../../components/add-contact/add-contact";
import { ContactProvider } from "../../../providers/contact/contact";
import { contact } from "../../../interfaces/contact";
import { ContactStatus } from "../../../functions/colors";

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  contacts: contact[];
  pageStatus: string;
  userId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private contactProvider: ContactProvider,
    private actionSheet: ActionSheetController
  ) { }

  statusColor(status) {
    if (status === 'Called') {
      return { color: ContactStatus.called, fontWeight: 'bold' };
    } else if (status === 'Appointment secured') {
      return { color: ContactStatus.appointmentSecured, fontWeight: 'bold' };
    } else if (status === 'Rejected') {
      return { color: ContactStatus.rejected, fontWeight: 'bold' };
    } else if (status === 'None') {
      return { color: ContactStatus.none, fontWeight: 'bold' };
    } else if (status === 'Client' || status === 'Customer') {
      return { color: ContactStatus.client, fontWeight: 'bold' };
    } else {
      return { color: ContactStatus.other, fontWeight: 'bold' };
    }
  }

  addContact() {
    const modal = this.modalCtrl.create(AddContactComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
      }
    });
  }

  fetch() {
    this.pageStatus = 'loading';
    this.contactProvider.userId().then(userId => {
      this.contactProvider.getContacts(userId).subscribe(observe => {
        this.pageStatus = undefined;
        this.contacts = observe;
      }, () => {
        this.pageStatus = 'error';
      });
    });
  }

  changeStatusHandler(contact: contact, index: number) {
    console.log(contact, index);
  }

  changeStatus(contact: contact, index: number) {
    const actionSheet = this.actionSheet.create({
      buttons: [
        { text: 'Called', handler: () => this.changeStatusHandler(contact, index) },
        { text: 'Cancel', role: 'cancel', cssClass: 'danger-alert' }
      ]
    });
    actionSheet.present();
  }

  viewMore(contact, index) {
    const actionSheet = this.actionSheet.create({
      buttons: [
        { text: 'Change status', handler: () => this.changeStatus(contact, index) },
        { text: 'Cancel', cssClass: 'danger-alert', role: 'cancel' }
      ]
    });
    actionSheet.present();
  }

  showDetail(contact: contact) {
    this.navCtrl.push(ContactDetailPage, { contact });
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
