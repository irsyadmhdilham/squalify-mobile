import { Component, ViewChild } from '@angular/core';
import { ViewController, Select, AlertController, LoadingController } from "ionic-angular";

import { ContactProvider } from "../../providers/contact/contact";

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
    private loadingCtrl: LoadingController,
    private contactProvider: ContactProvider
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  focus(event) {
    if (event.key === 'Enter') {
      this._contactType.open();
    }
  }

  addContact(name, status, contactType, contactNo) {
    try {
      if (!name.valid) {
        throw 'Please insert name';
      }
      if (!status.valid) {
        throw 'Please select status';
      }
      if (!contactType.valid) {
        throw 'Please select contact type';
      }
      if (!contactNo.valid) {
        throw 'Please insert contact no';
      }
      const nameVal = name.value,
            statusVal = status.value,
            contactTypeVal = contactType.value,
            contactNoVal = contactNo.value;
      this.contactProvider.addContact
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
