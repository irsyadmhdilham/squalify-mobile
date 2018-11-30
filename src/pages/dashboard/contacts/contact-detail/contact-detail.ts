import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController
} from 'ionic-angular';

import { EditContactComponent } from "../../../../components/contact/edit-contact/edit-contact";
import { ScheduleDetailPage } from "../../schedules/schedule-detail/schedule-detail";
import { ContactProvider } from "../../../../providers/contact/contact";
import { schedule } from "../../../../interfaces/schedule";

@IonicPage()
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html',
})
export class ContactDetailPage {

  pk: number;
  name: string;
  status: string;
  contactType: string;
  contactNo: string;
  remark: string;
  edited = false;
  pageStatus: string;
  schedules: schedule[] = [];
  from = 'contact';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private contactProvider: ContactProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  statusColor(status) {
    switch (status) {
      case 'Called':
        return 'called';
      case 'Appointment secured':
        return 'appointmentSecured';
      case 'Rejected':
        return 'rejected';
      case 'Other':
        return 'other';
      case 'None':
        return 'none';
      case 'Client' || 'Customer':
        return 'client';
    }
  }

  async getContact() {
    const userId = await this.contactProvider.userId();
    this.pageStatus = 'loading';
    this.contactProvider.getContactDetail(userId, this.pk).subscribe(observe => {
      this.pageStatus = undefined;
      this.name = observe.name;
      this.status = observe.status;
      this.contactType = observe.contact_type;
      this.contactNo = observe.contact_no;
      this.remark = observe.remark;
      if (observe.schedules) {
        this.schedules = observe.schedules.map(val => {
          return {
            ...val,
            date: new Date(val.date)
          };
        });
      }
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    const contactId = this.navParams.get('contactId'),
          from = this.navParams.get('from');
    if (from === 'schedule') {
      this.from = from;
    }
    this.pk = contactId;
    this.getContact();
  }

  editContact() {
    const modal = this.modalCtrl.create(EditContactComponent, {
      contact: {
        pk: this.pk,
        name: this.name,
        status: this.status,
        contact_type: this.contactType,
        contact_no: this.contactNo,
        remark: this.remark
      }
    });
    modal.present();
    modal.onDidDismiss(contact => {
      if (contact) {
        this.name = contact.name;
        this.status = contact.status,
        this.contactType = contact.contact_type;
        this.contactNo = contact.contact_no;
        this.remark = contact.remark;
        this.edited = contact.edited
      }
    });
  }

  removeContact() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.contactProvider.userId().then(userId => {
      this.contactProvider.removeContact(userId, this.pk).subscribe(() => {
        loading.dismiss();
        this.navCtrl.pop();
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

  showSchedule(id: number) {
    this.navCtrl.push(ScheduleDetailPage, {
      scheduleId: id,
      from: 'contact'
    });
  }

}
