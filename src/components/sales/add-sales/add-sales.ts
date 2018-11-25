import { Component } from '@angular/core';
import { NgModel } from "@angular/forms";
import { ViewController, AlertController } from "ionic-angular";

import { AgencyProvider } from "../../../providers/agency/agency";

@Component({
  selector: 'add-sales',
  templateUrl: 'add-sales.html'
})
export class AddSalesComponent {

  screenStatus: string;
  company: string;
  repeatSales = false;
  newSales = false;

  constructor(
    private viewCtrl: ViewController,
    private agencyProvider: AgencyProvider,
    private alertCtrl: AlertController
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

  async getCompany() {
    this.screenStatus = 'loading';
    const agencyId = await this.agencyProvider.agencyId();
    this.agencyProvider.getAgencyDetail(agencyId, 'company').subscribe(observe => {
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

  addSales(amount: NgModel, salesType: NgModel, surcharge: NgModel) {
    try {
      if (!amount.valid) {
        throw 'Please insert sales amount';
      }
      if (!salesType.valid) {
        throw 'Please select sales type';
      }
      if (this.company === 'CWA' && amount.value === 'EPF' || amount.value === 'Cash') {
        if (!surcharge.valid) {
          throw 'Please select surcharge';
        }
      }
      console.log({
        amount: amount.value,
        salesType: salesType.value,
        newSales: this.newSales,
        repeatSales: this.repeatSales
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
