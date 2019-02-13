import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  AlertController,
  LoadingController,
  Platform,
  Segment,
  Toggle
} from 'ionic-angular';
import { CallNumber } from "@ionic-native/call-number";
import * as moment from "moment";

import { ContactDetailPage } from "./contact-detail/contact-detail";

import { AddContactComponent } from "../../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";

import { ContactProvider } from "../../../providers/contact/contact";
import { contact, logs } from "../../../models/contact";
import { ContactStatus, Colors } from "../../../functions/colors";

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  contacts: contact[] = [];
  callLogs: logs[] = [];
  pageStatus: string;
  userId: number;
  segment = 'contacts';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private contactProvider: ContactProvider,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private callNumber: CallNumber,
    private platform: Platform
  ) {
    moment.updateLocale('en', {
      calendar: {
        lastDay: '[Yesterday], h:mma',
        sameDay: '[Today], h:mma',
        sameElse: 'D MMM YYYY, h:mma'
      }
    });
  }

  changeSegment(event: Segment) {
    if (event.value === 'contacts' && this.contacts.length === 0) {
      this.fetch();
    } else if (event.value === 'call logs' && this.callLogs.length === 0) {

    }
  }

  statusColor(status) {
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

  call(contact: contact, index: number) {
    const isCordova = this.platform.is('cordova'),
          isMobile = this.platform.is('mobile');
    if (isCordova && isMobile) {
      this.callNumber.callNumber(contact.contact_no, true).then(() => {
        this.contactProvider.createCallLog(contact.name).subscribe(() => {
          const actionSheet = this.actionSheetCtrl.create({
            title: 'Get an appointment?',
            buttons: [
              { text: 'Yes, I got', handler: () => {
                const modal = this.modalCtrl.create(AddScheduleComponent, {
                  appointmentSecured: true
                });
                modal.present();
                modal.onDidDismiss(data => {
                  if (data) {
                    contact.status = 'Appointment secured';
                    contact.scheduleId = data.schedule.pk;
                    this.updateContact(contact, index);
                  }
                });
              }},
              { text: "No, I don't get" }
            ]
          });
          actionSheet.present();
        }, () => {
          const alert = this.alertCtrl.create({title: 'Error', subTitle: 'Failed to add call log', buttons: ['Ok']});
          alert.present();
        });
      });
    }
  }

  addContact() {
    const modal = this.modalCtrl.create(AddContactComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.pageStatus = undefined;
        this.contacts.unshift(data.newContact);
      }
    });
  }

  fetchCallLogs() {
    this.pageStatus = 'loading';
    this.contactProvider.getCallLogs().subscribe(callLogs => {
      this.pageStatus = undefined;
      this.callLogs = callLogs;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  fetch() {
    this.pageStatus = 'loading';
    this.contactProvider.getContacts('pk,name,status,contact_type,contact_no,email').subscribe(observe => {
      this.pageStatus = undefined;
      this.contacts = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  changeStatusHandler(contact: contact, index: number, value: string) {
    if (contact.status === value) {
      return;
    }
    if (value === 'Appointment secured') {
      const modal = this.modalCtrl.create(AddScheduleComponent, {
        appointmentSecured: true
      });
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
    this.contactProvider.updateContact(contact.pk, contact).subscribe(observe => {
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
  }

  changeStatus(contact: contact, index: number) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        { text: 'Call back', handler: () => this.changeStatusHandler(contact, index, 'Call back') },
        { text: 'Appointment secured', handler: () => this.changeStatusHandler(contact, index, 'Appointment secured') },
        { text: 'Rejected', handler: () => this.changeStatusHandler(contact, index, 'Rejected') },
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

  logDate(date: string) {
    return moment(date).calendar();
  }

  updateLog(event: Toggle, id: number) {
    this.contactProvider.updateCallLog(id, event.value).subscribe();
  }

  logStatus(answered: boolean) {
    const color = answered ? Colors.secondary : Colors.danger;
    return { color };
  }

}
