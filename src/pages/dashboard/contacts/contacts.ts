import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

import { AddContactComponent } from "../../../components/add-contact/add-contact";
import { ContactProvider } from "../../../providers/contact/contact";
import { contact } from "../../../interfaces/contact";
import { ContactStatus } from "../../../functions/colors";

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  contacts: contact[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private contactProvider: ContactProvider,
    private actionSheet: ActionSheetController
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

    addContact() {
      const modal = this.modalCtrl.create(AddContactComponent);
      modal.present();
      modal.onDidDismiss(data => {
        if (data) {
          console.log(data);
        }
      });
    }

    fetch() {
      this.contactProvider.getContacts().subscribe(observe => {
        this.contacts = observe;
      });
    }

    ionViewDidLoad() {
      this.fetch();
    }

}
