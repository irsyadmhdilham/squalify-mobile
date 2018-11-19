import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';

import { contact } from "../../../../interfaces/contact";
import { EditContactComponent } from "../../../../components/contact/edit-contact/edit-contact";
import { ContactProvider } from "../../../../providers/contact/contact";

@IonicPage()
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html',
})
export class ContactDetailPage {

  index: number;
  pk: number;
  name: string;
  status: string;
  contactType: string;
  contactNo: string;
  remark: string;
  edited = false;

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

  ionViewDidLoad() {
    const contact: contact = this.navParams.get('contact');
    const index: number = this.navParams.get('index');
    this.index = index;
    this.pk = contact.pk;
    this.name = contact.name;
    this.status = contact.status;
    this.contactType = contact.contact_type;
    this.contactNo = contact.contact_no;
    this.remark = contact.remark;
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

}
