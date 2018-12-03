import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

import { SalesProvider } from "../../../providers/sales/sales";
import { roundDecimal } from '../../../functions/number-commas';

@Component({
  selector: 'sales-summary',
  templateUrl: 'sales-summary.html'
})
export class SalesSummaryComponent {

  today = { sales: '0', income: '0' };
  week = { sales: '0', income: '0' };
  month = { sales: '0', income: '0' };
  year = { sales: '0', income: '0' };
  screenStatus: string;

  constructor(private salesProvider: SalesProvider, private viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  numCommas(value) {
    return roundDecimal(parseFloat(value));
  }

  async fetch() {
    const userId = await this.salesProvider.userId();
    this.screenStatus = 'loading';
    this.salesProvider.getPersonalSummary(userId).subscribe(observe => {
      this.screenStatus = undefined;
      this.today = { sales: this.numCommas(observe.today.Total.sales), income: this.numCommas(observe.today.Total.income) };
      this.month = { sales: this.numCommas(observe.month.Total.sales), income: this.numCommas(observe.month.Total.income) };
      this.year = { sales: this.numCommas(observe.year.Total.sales), income: this.numCommas(observe.year.Total.income) };
    }, () => {
      this.screenStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
