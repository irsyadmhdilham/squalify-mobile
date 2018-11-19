import { Component, ViewChild } from '@angular/core';
import { ViewController, Select, AlertController, LoadingController, NavParams } from "ionic-angular";

import { contact } from "../../../interfaces/contact";

import { ContactProvider } from "../../../providers/contact/contact";

@Component({
  selector: 'edit-contact',
  templateUrl: 'edit-contact.html'
})
export class EditContactComponent {

  pk: number;
  name: string;
  status: string;
  contactType: string;
  contactNo: string;
  remark: string;
  contactTypeSelectOptions = { title: 'Select contact type' };
  statusSelectOptions = { title: 'Select status' };
  @ViewChild('_contactType') _contactType: Select;

  constructor(
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private contactProvider: ContactProvider,
    private navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  focus(event) {
    if (event.key === 'Enter') {
      this._contactType.open();
    }
  }

  updateContact(nameNgModel, statusNgModel, contactTypeNgModel, contactNoNgModel, remarkNgModel) {
    try {
      if (!nameNgModel.valid) {
        throw 'Please insert name';
      }
      if (!statusNgModel.valid) {
        throw 'Please select status';
      }
      if (!contactTypeNgModel.valid) {
        throw 'Please select contact type';
      }
      if (!contactNoNgModel.valid) {
        throw 'Please insert contact no';
      }
      const name = nameNgModel.value,
            status = statusNgModel.value,
            contact_type = contactTypeNgModel.value,
            contact_no = contactNoNgModel.value,
            remark = remarkNgModel.value;
      const data = { name, status, contact_type, contact_no, remark };
      const loading = this.loadingCtrl.create({ content: 'Please wait' });
      loading.present();
      this.contactProvider.userId().then(userId => {
        this.contactProvider.updateContact(userId, this.pk, data).subscribe(observe => {
          loading.dismiss();
          this.viewCtrl.dismiss({
            name: observe.name,
            status: observe.status,
            contact_type: observe.contact_type,
            contact_no: observe.contact_no,
            remark: observe.remark,
            edited: true
          });
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
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Empty required field',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  ionViewDidLoad() {
    const contact: contact = this.navParams.get('contact');
    this.pk = contact.pk;
    this.name = contact.name;
    this.status = contact.status;
    this.contactType = contact.contact_type;
    this.contactNo = contact.contact_no;
    this.remark = contact.remark;
  }

}
