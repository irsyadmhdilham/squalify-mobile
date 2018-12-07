import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

import { SalesProvider } from "../../../providers/sales/sales";

interface output {
  sales: number;
  income?: number;
}

@Component({
  selector: 'sales-summary',
  templateUrl: 'sales-summary.html'
})
export class SalesSummaryComponent {

  today: output = { sales: 0, income: 0 };
  week: output = { sales: 0, income: 0 };
  month: output = { sales: 0, income: 0 };
  year: output = { sales: 0, income: 0 };
  screenStatus: string;
  segment: string;

  constructor(
    private salesProvider: SalesProvider,
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) { }

  type: string;

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async fetch() {
    const userId = await this.salesProvider.userId();
    this.screenStatus = 'loading';
    this.salesProvider.getPersonalSummary(userId, this.type).subscribe(observe => {
      this.screenStatus = undefined;
      this.today = { sales: parseFloat(observe.today.sales), income: parseFloat(observe.today.income) };
      this.month = { sales: parseFloat(observe.month.sales), income: parseFloat(observe.month.income) };
      this.year = { sales: parseFloat(observe.year.sales), income: parseFloat(observe.year.income) };
      this.week = { sales: parseFloat(observe.week.sales), income: parseFloat(observe.week.income) };
    }, () => {
      this.screenStatus = 'error';
    });
  }

  async fetchGroup() {
    const userId = await this.salesProvider.userId();
    this.screenStatus = 'loading';
    this.salesProvider.getGroupSummary(userId, this.type).subscribe(observe => {
      this.screenStatus = undefined;
      this.today = { sales: parseFloat(observe.today)};
      this.month = { sales: parseFloat(observe.month)};
      this.year = { sales: parseFloat(observe.year)};
      this.week = { sales: parseFloat(observe.week)};
    }, () => {
      this.screenStatus = 'error';
    });
  }

  ionViewDidLoad() {
    const type = this.navParams.get('type'),
          segment = this.navParams.get('segment');
    this.type = type;
    this.segment = segment;
    if (segment === 'personal') {
      this.fetch();
    } else {
      this.fetchGroup();
    }
  }

}
