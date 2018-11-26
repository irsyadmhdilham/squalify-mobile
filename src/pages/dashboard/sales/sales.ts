import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { SalesProvider } from "../../../providers/sales/sales";
import { agency } from "../../../interfaces/agency";
import { sales } from "../../../interfaces/sales";

import { AddSalesComponent } from "../../../components/sales/add-sales/add-sales";
import { SalesDetailComponent } from "../../../components/sales/sales-detail/sales-detail";

@IonicPage()
@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
})
export class SalesPage {

  segment = 'personal';
  agency: agency;
  pageStatus: string;
  personalSales: sales[] = [];
  groupSales = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private salesProvider: SalesProvider
  ) { }

  showSummary() {
    if (this.personalSales.length !== 0 && this.segment === 'personal') {
      return true;
    } else if (this.groupSales.length !== 0 && this.segment === 'group') {
      return true;
    }
  }

  segmentChanged(event) {
    const value = event.value;
    if (value === 'personal') {
      if (!this.personalSales && this.pageStatus !== 'loading') {
        this.fetchPersonalSales();
      }
    } else {
      if (!this.groupSales && this.pageStatus !== 'loading') {
        console.log('fetch group');
      }
    }
  }

  addSales() {
    const modal = this.modalCtrl.create(AddSalesComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        const sales = {
          ...data.sales,
          amount: parseFloat(data.sales.amount),
          timestamp: new Date(data.sales.timestamp)
        };
        this.personalSales.unshift(sales);
      }
    });
  }

  async fetchPersonalSales() {
    const userId = await this.salesProvider.userId();
    this.pageStatus = 'loading';
    this.salesProvider.getSales(userId).subscribe(observe => {
      this.pageStatus = undefined;
      this.personalSales = observe.map(val => {
        return {
          ...val,
          timestamp: new Date(val.timestamp),
          amount: parseFloat(val.amount)
        };
      });
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetchPersonalSales();
  }

  showDetail(sales, index) {
    const modal = this.modalCtrl.create(SalesDetailComponent, { sales, index });
    modal.present();
    modal.onDidDismiss(cb => {
      if (cb) {
        if (cb.removed) {
          this.personalSales.splice(cb.index, 1);
        }
      }
    });
  }

}
