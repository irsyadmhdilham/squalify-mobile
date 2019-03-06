import { Component } from '@angular/core';
import { NgModel } from "@angular/forms";
import {
  ViewController,
  AlertController,
  LoadingController
} from "ionic-angular";

import { AgencyProvider } from "../../../providers/agency/agency";
import { SalesProvider } from "../../../providers/sales/sales";

import { sales } from "../../../models/sales";
type data = sales & { tips?: string };

@Component({
  selector: 'add-sales',
  templateUrl: 'add-sales.html'
})
export class AddSalesComponent {

  screenStatus: string;
  company: string;
  tips: string;
  status = 'Submitted'

  constructor(
    private viewCtrl: ViewController,
    private agencyProvider: AgencyProvider,
    private salesProvider: SalesProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
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

  removeTips() {
    this.tips = undefined;
  }

  ionViewDidLoad() {
    this.getCompany();
  }

  async addSales(amountNgModel: NgModel, salesTypeNgModel: NgModel, locationNgModel: NgModel, statusNgModel: NgModel) {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    try {
      if (!amountNgModel.valid) {
        throw 'Please insert sales amount';
      }
      if (!salesTypeNgModel.valid) {
        throw 'Please select sales type';
      }
      let data: data  = {
        amount: parseFloat(amountNgModel.value),
        sales_type: salesTypeNgModel.value,
        sales_status: this.status
      };
      if (locationNgModel.value !== '') {
        data.location = locationNgModel.value;
      }
      if (this.tips) {
        data.tips = this.tips;
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
