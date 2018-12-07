import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { ScoreboardProvider } from "../../../providers/scoreboard/scoreboard";

@IonicPage()
@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html',
})
export class ScoreboardPage {

  segment = 'sales';
  pageStatus: string;
  periodActive = false;
  salesType = 'Sales type';
  salesTypeActive = false;
  period = 'period';
  salesScorer = [];
  pointScorer = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private scoreboardProvider: ScoreboardProvider,
    private actionSheetCtrl: ActionSheetController
  ) { }

  selectSalesType() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select sales type',
      buttons: [
        { text: 'Total', handler: () => { this.salesType = 'total'; this.salesTypeActive = true; } },
        { text: 'EPF', handler: () => { this.salesType = 'epf'; this.salesTypeActive = true; } },
        { text: 'Cash', handler: () => { this.salesType = 'Cash'; this.salesTypeActive = true; } },
        { text: 'ASB', handler: () => { this.salesType = 'asb'; this.salesTypeActive = true; } },
        { text: 'PRS', handler: () => { this.salesType = 'prs'; this.salesTypeActive = true; } },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    actionSheet.present();
    actionSheet.onDidDismiss(() => {
      let period = this.period;
      if (period === 'period') {
        period = 'year';
      }
      if (this.segment === 'sales') {
        this.fetchSalesScore(period, this.salesType);
      }
    });
  }

  selectPeriod() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select period',
      buttons: [
        { text: 'Year', handler: () => { this.period = 'year'; this.periodActive = true; }},
        { text: 'Month', handler: () => { this.period = 'month'; this.periodActive = true; }},
        { text: 'Week', handler: () => { this.period = 'week'; this.periodActive = true; }},
        { text: 'Today', handler: () => { this.period = 'today'; this.periodActive = true; }},
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    actionSheet.present();
    actionSheet.onDidDismiss(() => {
      let period = this.period;
      if (period === 'period') {
        period = 'year';
      }
      if (this.segment === 'sales') {
        let salesType = this.salesType;
        if (salesType === 'Sales type') {
          salesType = 'total';
        }
        this.fetchSalesScore(period, salesType);
      } else {
        this.fetchPointScore(period);
      }
    });
  }

  segmentChanged(event) {
    const value = event.value;
    let period = this.period;
    if (period === 'period') {
      period = 'year';
    }
    if (value === 'sales') {
      let salesType = this.salesType;
      if (salesType === 'Sales type') {
        salesType = 'total';
      }
      this.fetchSalesScore(period, salesType);
    } else {
      this.fetchPointScore(period);
    }
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  async fetchSalesScore(period, salesType) {
    const userId = await this.scoreboardProvider.userId();
    this.pageStatus = 'loading';
    this.scoreboardProvider.getSalesScore(userId, period, salesType).subscribe(observe => {
      this.pageStatus = undefined;
      const sales = observe.map(val => {
        return {
          ...val,
          amount: parseFloat(val.amount)
        };
      });
      this.salesScorer = sales;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  async fetchPointScore(period) {
    const userId = await this.scoreboardProvider.userId();
    this.pageStatus = 'loading';
    this.scoreboardProvider.getPointScore(userId, period).subscribe(observe => {
      this.pageStatus = undefined;
      this.pointScorer = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetchSalesScore('year', 'total');
  }

}
