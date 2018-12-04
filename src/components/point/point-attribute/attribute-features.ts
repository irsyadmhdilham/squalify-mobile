import { ModalController } from "ionic-angular";

import { AddSalesComponent } from "../../../components/sales/add-sales/add-sales";
import { AddContactComponent } from "../../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";

export class AttributeFeatures {

  constructor(public modalCtrl: ModalController) { }

  modal(component, data?) {
    if (data) {
      return this.modalCtrl.create(component, data);
    }
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

  addFTF() {
    return new Promise(resolve => {
      const modal = this.modal(AddContactComponent);
      modal.present();
      modal.onDidDismiss(data => {
        resolve(data);
      });
    });
  }

  addReferral() {
    return new Promise(resolve => {
      const modal = this.modal(AddContactComponent, { contactType: 'Referral' });
      modal.present();
      modal.onDidDismiss(data => {
        resolve(data);
      });
    });
  }

  addSchedule() {
    return new Promise(resolve => {
      const modal = this.modal(AddScheduleComponent, { appointmentSecured: true });
      modal.present();
      modal.onDidDismiss(data => {
        resolve(data);
      });
    });
  }
}