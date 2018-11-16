import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AddContactComponent } from "../../../components/add-contact/add-contact";

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

    addContact() {
      const modal = this.modalCtrl.create(AddContactComponent);
      modal.present();
    }

    ionViewDidLoad() {
      this.addContact();
    }

}
