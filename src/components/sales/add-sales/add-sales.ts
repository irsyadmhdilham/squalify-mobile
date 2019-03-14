import { Component } from '@angular/core';
import { NgModel } from "@angular/forms";
import {
  ViewController,
  AlertController,
  LoadingController,
  ModalController,
  ActionSheetController
} from "ionic-angular";

import { AgencyProvider } from "../../../providers/agency/agency";
import { SalesProvider } from "../../../providers/sales/sales";

import { contact } from "../../../models/contact";
import { ContactListComponent } from "../../contact/contact-list/contact-list";

@Component({
  selector: 'add-sales',
  templateUrl: 'add-sales.html'
})
export class AddSalesComponent {

  screenStatus: string;
  company: string;
  status = 'Submitted'
  contact: string;
  contactId: number;
  clientMethod: string;

  constructor(
    private viewCtrl: ViewController,
    private agencyProvider: AgencyProvider,
    private salesProvider: SalesProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  salesTypes() {
    if (this.company === 'CWA') {
      return ['EPF', 'Cash', 'ASB', 'PRS', 'Wasiat', 'Takaful'];
    } else if (this.company === 'Public Mutual') {
      return ['EPF', 'Cash'];
    }
  }

  surcharges() {
    if (this.company === 'CWA') {
      return [5, 6.5];
    }
    return false;
  }

  getCompany() {
    this.screenStatus = 'loading';
    this.agencyProvider.getAgencyDetail('company').subscribe(observe => {
      this.screenStatus = undefined;
      this.company = observe.company;
    }, () => {
      this.screenStatus = undefined;
      const alert = this.alertCtrl.create({
        title: 'Error has occured',
        subTitle: 'Failed to receive data',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  ionViewDidLoad() {
    this.getCompany();
  }

  clientMethodHandler() {
    const action = this.actionSheetCtrl.create({
      title: 'Select method',
      buttons: [
        { text: 'Select from contact', handler: () => {this.clientMethod = 'contact'; this.contact = '';}},
        { text: 'Write client name', handler: () => {{this.clientMethod = 'write'; this.contact = '';}} },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    action.present();
  }

  pickContact() {
    const modal = this.modalCtrl.create(ContactListComponent, { sales: true });
    modal.present();
    modal.onDidDismiss((data: contact) => {
      if (data) {
        this.contact = data.name;
        this.contactId = data.pk;
      }
    })
  }

  async addSales(amountNgModel: NgModel, salesTypeNgModel: NgModel, locationNgModel: NgModel) {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    try {
      if (!amountNgModel.valid) {
        throw 'Please insert sales amount';
      }
      if (!salesTypeNgModel.valid) {
        throw 'Please select sales type';
      }
      if (!this.contact || this.contact === '') {
        throw 'Please insert client name';
      }
      let data: any  = {
        amount: parseFloat(amountNgModel.value),
        sales_type: salesTypeNgModel.value,
        sales_status: this.status
      };
      if (this.clientMethod === 'contact') {
        data.contact = this.contactId;
      } else if (this.clientMethod === 'write') {
        data.client_name = this.contact;
      }
      if (locationNgModel.value !== '') {
        data.location = locationNgModel.value;
      }
      loading.present();
      this.salesProvider.createSales(data).subscribe(sales => {
        loading.dismiss();
        this.salesProvider.addSalesEmit(sales.amount);
        this.viewCtrl.dismiss({ sales });
      }, () => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error has occured',
          subTitle: 'Failed to add sales, please try again later',
          buttons: ['Ok']
        });
        alert.present();
      });
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Required field empty',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
