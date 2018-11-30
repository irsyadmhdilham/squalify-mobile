import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  AlertController,
  LoadingController
} from 'ionic-angular';

import { ContactDetailPage } from "./contact-detail/contact-detail";

import { AddContactComponent } from "../../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";

import { ContactProvider } from "../../../providers/contact/contact";
import { contact } from "../../../interfaces/contact";
import { ContactStatus } from "../../../functions/colors";

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  contacts: contact[] = [];
  pageStatus: string;
  userId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private contactProvider: ContactProvider,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
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
        this.pageStatus = undefined;
        this.contacts.push(data.newContact);
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

  changeStatusHandler(contact: contact, index: number, value: string) {
    if (contact.status === value) {
      return;
    }
    if (value === 'Appointment secured') {
      const modal = this.modalCtrl.create(AddScheduleComponent);
      modal.present();
      modal.onDidDismiss(data => {
        if (data) {
          contact.status = value;
          contact.scheduleId = data.schedule.pk;
          this.updateContact(contact, index);
        }
      });
    } else {
      contact.status = value;
      this.updateContact(contact, index);
    }
  }

  updateContact(contact: contact, index: number) {
    const loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();
    this.contactProvider.userId().then(userId => {
      this.contactProvider.updateContact(userId, contact.pk, contact).subscribe(observe => {
        loading.dismiss();
        this.contacts[index] = observe;
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
    });
  }

  changeStatus(contact: contact, index: number) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        { text: 'Called', handler: () => this.changeStatusHandler(contact, index, 'Called') },
        { text: 'Appointment secured', handler: () => this.changeStatusHandler(contact, index, 'Appointment secured') },
        { text: 'Rejected', handler: () => this.changeStatusHandler(contact, index, 'Rejected') },
        { text: 'Other', handler: () => this.changeStatusHandler(contact, index, 'Other') },
        { text: 'Client', handler: () => this.changeStatusHandler(contact, index, 'Client') },
        { text: 'Cancel', role: 'cancel', cssClass: 'danger-alert' }
      ]
    });
    actionSheet.present();
  }

  viewMore(contact, index) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        { text: 'Change status', handler: () => this.changeStatus(contact, index) },
        { text: 'Cancel', cssClass: 'danger-alert', role: 'cancel' }
      ]
    });
    actionSheet.present();
  }

  showDetail(contact: contact) {
    this.navCtrl.push(ContactDetailPage, { contactId: contact.pk })
  }

  ionViewWillEnter() {
    this.fetch();
  }

}
