import { ModalController } from "ionic-angular";

import { AddSalesComponent } from "../../../components/sales/add-sales/add-sales";
import { AddContactComponent } from "../../../components/contact/add-contact/add-contact";

export class AttributeFeatures {

  constructor(public modalCtrl: ModalController) { }

  modal(component) {
    return this.modalCtrl.create(component);
  }

  caseClosed() {
    return new Promise(resolve => {
      const modal = this.modal(AddSalesComponent);
      modal.present();
      modal.onDidDismiss(data => {
        resolve(data);
      });
    });
  }

  addContact() {
    return new Promise(resolve => {
      const modal = this.modal(AddContactComponent);
      modal.present();
      modal.onDidDismiss(data => {
        resolve(data);
      });
    });
  }
}