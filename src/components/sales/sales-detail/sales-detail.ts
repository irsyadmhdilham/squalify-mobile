import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, AlertController } from "ionic-angular";

import { Colors } from "../../../functions/colors";
import { sales } from "../../../models/sales";

import { SalesProvider } from "../../../providers/sales/sales";

@Component({
  selector: 'sales-detail',
  templateUrl: 'sales-detail.html'
})
export class SalesDetailComponent {

  pk: number;
  index: number;
  timestamp: Date;
  location: string;
  amount: number;
  salesStatus: string;
  salesType: string;
  removed = false;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private salesProvider: SalesProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  salesStatusStyle() {
    if (this.salesStatus === 'Submitted') {
      return { color: Colors.orange };
    } else if (this.salesStatus === 'Disbursed') {
      return { color: Colors.secondary };
    }
  }

  ionViewDidLoad() {
    const sales: sales = this.navParams.get('sales');
    const index = this.navParams.get('index');
    this.timestamp = sales.timestamp;
    this.location = sales.location;
    this.amount = sales.amount;
    this.index = index;
    this.pk = sales.pk;
    this.salesType = sales.sales_type;
  }

  removeSales() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.salesProvider.removeSales(this.pk).subscribe(() => {
      loading.dismiss();
      this.viewCtrl.dismiss({
        removed: true,
        index: this.index
      });
    }, () => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Error has occured',
        subTitle: 'Failed to remove sales',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
