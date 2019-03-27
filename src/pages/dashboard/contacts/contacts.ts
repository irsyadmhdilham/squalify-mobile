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
  Toggle,
  ToastController
} from 'ionic-angular';
import { CallNumber } from "@ionic-native/call-number";
import * as moment from "moment";

import { ContactDetailPage } from "./contact-detail/contact-detail";

import { AddContactComponent } from "../../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";
import { ContactFilterComponent } from "../../../components/contact/contact-filter/contact-filter";
import { LogRemarkComponent } from "../../../components/contact/log-remark/log-remark";

import { ContactProvider } from "../../../providers/contact/contact";
import { contact, logs } from "../../../models/contact";
import { ContactStatus, Colors } from "../../../functions/colors";

interface filterData {
  segment: string;
  contactStatus?: string;
  contactType?: string;
  date?: { from: string; until: string; };
  name: string;
  answered?: string;
}

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
  filterData: filterData;
  notFound: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private contactProvider: ContactProvider,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private callNumber: CallNumber,
    private platform: Platform,
    private toastCtrl: ToastController
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
    } else if (event.value === 'call logs') {
      this.fetchCallLogs();
    }
  }

  addRemark(logs: logs, index: number) {
    const modal = this.modalCtrl.create(LogRemarkComponent, { logs, index });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.callLogs[data.index] = data.logs;
      }
    });
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
        this.contactProvider.createCallLog(contact.pk).subscribe(() => {
          // const actionSheet = this.actionSheetCtrl.create({
          //   title: 'Get an appointment?',
          //   buttons: [
          //     { text: 'Yes, I got', handler: () => {
          //       const modal = this.modalCtrl.create(AddScheduleComponent, {
          //         appointmentSecured: true
          //       });
          //       modal.present();
          //       modal.onDidDismiss(data => {
          //         if (data) {
          //           contact.status = 'Appointment secured';
          //           contact.scheduleId = data.schedule.pk;
          //           this.updateContact(contact, index);
          //         }
          //       });
          //     }},
          //     { text: "No, I don't get" }
          //   ]
          // });
          // actionSheet.present();
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
        this.notFound = false;
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

  viewMore(contact: contact, index) {
    const called = (contactVia: string) => {
      this.contactProvider.createCallLog(contact.pk,contactVia, contact.status, true).subscribe(() => {
        const toast = this.toastCtrl.create({
          message: 'Call log added',
          position: 'top',
          duration: 1500
        });
        toast.present();
      });
    };
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        { text: 'Contacted via Call', handler: () => called('Call')},
        { text: 'Contacted via Whatsapp', handler: () => called('Whatsapp')},
        { text: 'Contacted via Social media', handler: () => called('Social media')},
        { text: 'Contacted via Telegram', handler: () => called('Telegram')},
        { text: 'Contacted via Email', handler: () => called('Email')},
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
    this.contactProvider.updateCallLog(id, event.value).subscribe(() => {
      if (event.value) {
        const toast = this.toastCtrl.create({
          message: `Call point added`,
          position: 'top',
          duration: 1500
        });
        toast.present();
      }
    });
  }

  logStatus(answered: boolean) {
    const color = answered ? Colors.secondary : Colors.danger;
    return { color };
  }

  topContent() {
    if (this.segment === 'contacts') {
      return { justifyContent: 'space-between' };
    }
    return { justifyContent: 'flex-end' };
  }

  filter() {
    let data: { segment: string; data: filterData; };
    if (this.segment === 'contacts') {
      data = { segment:'contacts', data: this.filterData };
    } else {
      data = { segment: 'call logs', data: this.filterData };
    }
    const modal = this.modalCtrl.create(ContactFilterComponent, data);
    modal.present();
    modal.onDidDismiss((data: filterData) => {
      if (data) {
        this.filterData = data;
        const segment = data.segment;
        if (segment === 'contacts') {
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
        } else {
          const from = moment(data.date.from, 'YYYY-MM-DD HH:mm:ss').toISOString(),
                until = moment(data.date.until, 'YYYY-MM-DD HH:mm:ss').toISOString();
          let answered: boolean;
          if (data.answered !== undefined) {
            answered = data.answered === 'answered' ? true : false;
          }
          this.pageStatus = 'loading';
          this.contactProvider.callLogsFilter(answered, from, until, data.name).subscribe(logs => {
            this.pageStatus = undefined;
            if (logs.length === 0) {
              this.notFound = true;
            } else {
              this.notFound = false;
              this.callLogs = logs;
            }
          }, () => {
            this.pageStatus = undefined;
          });
        }
      }
    });
  }

}
