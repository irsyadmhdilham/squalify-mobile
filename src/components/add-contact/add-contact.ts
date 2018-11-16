import { Component, ViewChild } from '@angular/core';
import { ViewController, Select, AlertController } from "ionic-angular";
import { ImagePicker } from "@ionic-native/image-picker";

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
    private imagePicker: ImagePicker
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  focus(event) {
    if (event.key === 'Enter') {
      this._contactType.open();
    }
  }

  async getImage() {
    const options = { maximumImagesCount: 1 };
    const get = await this.imagePicker.getPictures(options);
    console.log(get);
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
