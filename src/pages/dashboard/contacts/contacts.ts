import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  AlertController,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { CallNumber } from "@ionic-native/call-number";

import { ContactDetailPage } from "./contact-detail/contact-detail";

import { AddContactComponent } from "../../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";

import { ContactProvider } from "../../../providers/contact/contact";
import { PointProvider } from "../../../providers/point/point";
import { UpdatePoint } from "../../../providers/point/update-point";
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
    private loadingCtrl: LoadingController,
    private callNumber: CallNumber,
    private pointProvider: PointProvider,
    private toastCtrl: ToastController
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

  callAnsweredHandler(userId, pointId, callPoint, contact: contact, index: number) {
    const update = new UpdatePoint(
      this.pointProvider,
      userId,
      pointId,
      callPoint.point,
      'Calls/Email/Socmed',
      callPoint.pk,
      1
    );
    update.add().then(response => {
      const toast = this.toastCtrl.create({
        message: `Call point added, total: ${response.point}`,
        duration: 1500,
        position: 'top'
      });
      toast.present();
      toast.onDidDismiss(() => {
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
      });
    });
  }

  call(contact: contact, index) {
    this.callNumber.callNumber(contact.contact_no, true).then(() => {
      const userId = this.pointProvider.userId;
      this.pointProvider.getContactPoints().subscribe(observe => {
        const pointId = observe.pk,
              callPoint = observe.calls;       
        const actionSheet = this.actionSheetCtrl.create({
          title: 'Call answered',
          buttons: [
            { text: 'Answered', handler: () => this.callAnsweredHandler(userId, pointId, callPoint, contact, index)},
            { text: 'Not answer' }
          ]
        });
        actionSheet.present();
      }, () => {
        const alert = this.alertCtrl.create({
          title: 'Error has occured',
          subTitle: 'Please try again later'
        });
        alert.present();
      });
    });
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
    this.contactProvider.getContacts('pk,name,status,contact_type,contact_no').subscribe(observe => {
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
