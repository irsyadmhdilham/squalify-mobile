import { Component } from '@angular/core';
import { ViewController, NavParams, ActionSheetController } from "ionic-angular";

import { SalesProvider } from "../../../providers/sales/sales";
import { salesStatus } from "../../../models/sales";

@Component({
  selector: 'sales-summary',
  templateUrl: 'sales-summary.html'
})
export class SalesSummaryComponent {

  salesStatus = {
    submitted: 0,
    rejected: 0,
    disburst: 0,
    in_hand: 0
  };
  today: salesStatus = this.salesStatus;
  week: salesStatus = this.salesStatus;
  month: salesStatus = this.salesStatus;
  year: salesStatus = this.salesStatus;
  screenStatus: string;
  segment: string;
  salesType = 'sales type';
  salesTypeActive = false
  cancel = false;

  constructor(
    private salesProvider: SalesProvider,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private actionSheetCtrl: ActionSheetController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectSalesType() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'All', handler: () => { this.salesType = 'All'; this.salesTypeActive = true; } },
        { text: 'EPF', handler: () => { this.salesType = 'EPF'; this.salesTypeActive = true; } },
        { text: 'Cash', handler: () => { this.salesType = 'Cash'; this.salesTypeActive = true; } },
        { text: 'ASB', handler: () => { this.salesType = 'ASB'; this.salesTypeActive = true; } },
        { text: 'PRS', handler: () => { this.salesType = 'PRS'; this.salesTypeActive = true; } },
        { text: 'Cancel', role: 'cancel', handler: () => {
          this.cancel = true;
          setTimeout(() => {
            this.cancel = false;
          }, 2000);
        }}
      ]
    });
    actionSheet.present();
    actionSheet.onDidDismiss(() => {
      if (!this.cancel) {
        if (this.segment === 'personal') {
          
        } else {
          this.fetchGroup();
        }
      }
    });
  }

  fetch() {
    this.screenStatus = 'loading';
    this.salesProvider.getPersonalSummary(this.salesType).subscribe(summary => {
      this.screenStatus = undefined;
      this.today = summary.today;
      this.month = summary.month;
      this.year = summary.year;
      this.week = summary.week;
    }, () => {
      this.screenStatus = 'error';
    });
  }

  fetchGroup() {
    this.screenStatus = 'loading';
    this.salesProvider.getGroupSummary(this.salesType).subscribe(summary => {
      this.screenStatus = undefined;
      this.today = summary.today;
      this.month = summary.month;
      this.year = summary.year;
      this.week = summary.week;
    }, () => {
      this.screenStatus = 'error';
    });
  }

  ionViewDidLoad() {
    const segment = this.navParams.get('segment');
    this.segment = segment;
    if (segment === 'personal') {
      this.fetch();
    } else {
      this.fetchGroup();
    }
  }

}
