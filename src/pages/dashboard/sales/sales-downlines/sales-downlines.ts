import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { SalesProvider } from "../../../../providers/sales/sales";

@IonicPage()
@Component({
  selector: 'page-sales-downlines',
  templateUrl: 'sales-downlines.html',
})
export class SalesDownlinesPage {

  pk: number;
  pageStatus: string;
  period = 'period';
  salesType = 'sales type';
  cancel = false;
  periodActive = false;
  salesTypeActive = false;
  downlines = [];
  name: string;
  designation: string;
  profileImage: string;
  downline: number;

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
      let period = this.period,
          salesType = this.salesType;
      if (period === 'period') {
        period = 'year';
      }
      if (salesType === 'sales type') {
        period = 'total';
      }
      if (!this.cancel) {
        this.fetch(period, salesType);
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
      let period = this.period,
          salesType = this.salesType;
      if (period === 'period') {
        period = 'year';
      }
      if (salesType === 'sales type') {
        period = 'total';
      }
      if (!this.cancel) {
        this.fetch(period, salesType);
      }
    });
  }

  async fetch(period: string, salesType: string) {
    const userId = await this.salesProvider.userId();
    this.pageStatus = 'loading';
    this.salesProvider.getGroupDownlineSales(userId, this.pk, period, salesType).subscribe(observe => {
      this.pageStatus = undefined;
      const downlines = observe.downlines.map(val => {
        return {
          ...val,
          amount: parseFloat(val.amount)
        };
      });
      this.downlines = downlines;
      this.name = observe.name;
      this.profileImage = observe.profile_image;
      this.designation = observe.designation;
      this.downline = observe.downlines.length;
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
    const memberId = this.navParams.get('memberId');
    this.pk = memberId;
    this.fetch('year', 'total');
  }

  navDownline(member) {
    this.navCtrl.push(SalesDownlinesPage, { memberId: member.pk });
  }

}
