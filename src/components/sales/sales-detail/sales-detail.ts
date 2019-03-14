import { Component } from '@angular/core';
import { ViewController, NavParams, LoadingController, AlertController, ModalController } from "ionic-angular";

import { sales } from "../../../models/sales";

import { SalesProvider } from "../../../providers/sales/sales";
import { EditSalesComponent } from "../edit-sales/edit-sales";

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
  client: string;
  removed = false;
  edited = false;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private salesProvider: SalesProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss({edited: this.edited, index: this.index, sales: this.navParams.get('sales') });
  }

  edit() {
    const modal = this.modalCtrl.create(EditSalesComponent, { sales: this.navParams.get('sales') });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.edited = data.edited;
        const sales: sales = data.sales;
        this.timestamp = sales.timestamp;
        this.location = sales.location;
        this.amount = sales.amount;
        this.pk = sales.pk;
        this.salesType = sales.sales_type;
        this.salesStatus = sales.sales_status;
        if (sales.client_name) {
          this.client = sales.client_name;
        } else if (sales.contact) {
          this.client = sales.contact.name;
        } else {
          this.client = 'No client name';
        }
      }
    });
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
    this.salesStatus = sales.sales_status;
    if (sales.client_name) {
      this.client = sales.client_name;
    } else if (sales.contact) {
      this.client = sales.contact.name;
    } else {
      this.client = 'No client name';
    }
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
