import { Component, ViewChild } from '@angular/core';
import { ViewController, Select, AlertController, LoadingController } from "ionic-angular";

import { ContactProvider } from "../../../providers/contact/contact";

@Component({
  selector: 'add-contact',
  templateUrl: 'add-contact.html'
})
export class AddContactComponent {

  status = 'None';
  contactTypeSelectOptions = { title: 'Select contact type' };
  statusSelectOptions = { title: 'Select status' };
  @ViewChild('_contactType') _contactType: Select;


  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private contactProvider: ContactProvider,
    private loadingCtrl: LoadingController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  focus(event) {
    if (event.key === 'Enter') {
      this._contactType.open();
    }
  }

  addContact(nameNgModel, statusNgModel, contactTypeNgModel, contactNoNgModel, remarkNgModel) {
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
        this.contactProvider.addContact(userId, data).subscribe(observe => {
          loading.dismiss();
          this.viewCtrl.dismiss({
            newContact: observe
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

}
