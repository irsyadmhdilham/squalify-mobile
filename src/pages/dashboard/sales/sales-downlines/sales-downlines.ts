import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { SalesProvider } from "../../../../providers/sales/sales";
import { groupSales } from "../../../../models/sales";

@Component({
  selector: 'page-sales-downlines',
  templateUrl: 'sales-downlines.html',
})
export class SalesDownlinesPage {

  member: groupSales = this.navParams.get('member');
  pageStatus: string;
  period = 'period';
  salesType = 'sales type';
  salesStatus = 'status';
  cancel = false;
  periodActive = false;
  salesTypeActive = false;
  salesStatusActive = false;
  downlines: groupSales[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private salesProvider: SalesProvider
  ) { }

  selectPeriod() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select period',
      buttons: [
        { text: 'Year', handler: () => { this.period = 'year'; this.periodActive = true; }},
        { text: 'Month', handler: () => { this.period = 'month'; this.periodActive = true; }},
        { text: 'Week', handler: () => { this.period = 'week'; this.periodActive = true; }},
        { text: 'Today', handler: () => { this.period = 'today'; this.periodActive = true; }},
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
        this.filter();
      }
    });
  }

  selectSalesType() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'Total', handler: () => { this.salesType = 'total'; this.salesTypeActive = true; } },
        { text: 'EPF', handler: () => { this.salesType = 'epf'; this.salesTypeActive = true; } },
        { text: 'Cash', handler: () => { this.salesType = 'cash'; this.salesTypeActive = true; } },
        { text: 'ASB', handler: () => { this.salesType = 'asb'; this.salesTypeActive = true; } },
        { text: 'PRS', handler: () => { this.salesType = 'prs'; this.salesTypeActive = true; } },
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
        this.filter();
      }
    });
  }

  selectSalesStatus() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'Total', handler: () => { this.salesStatus = 'total'; this.salesStatusActive = true; } },
        { text: 'In hand', handler: () => { this.salesStatus = 'In hand'; this.salesStatusActive = true; } },
        { text: 'Submitted', handler: () => { this.salesStatus = 'Submitted'; this.salesStatusActive = true; } },
        { text: 'Rejected', handler: () => { this.salesStatus = 'Rejected'; this.salesStatusActive = true; } },
        { text: 'Disburst/approved', handler: () => { this.salesStatus = 'Disburst'; this.salesStatusActive = true; } },
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
        this.filter();
      }
    });
  }

  fetch() {
    this.pageStatus = 'loading';
    this.salesProvider.getGroupDownlineSales(this.member.pk).subscribe(downlines => {
      this.pageStatus = undefined;
      this.downlines = downlines;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  filter() {
    this.pageStatus = 'loading';
    this.salesProvider.downlinesSalesFilter(this.member.pk, this.period, this.salesType, this.salesStatus).subscribe(downlines => {
      this.pageStatus = undefined;
      this.downlines = downlines;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  viewProfileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  ionViewDidLoad() {
    this.fetch();
  }

  navDownline(member: groupSales) {
    if (member.downlines && member.downlines > 0) {
      this.navCtrl.push(SalesDownlinesPage, { member });
    }
  }

}
