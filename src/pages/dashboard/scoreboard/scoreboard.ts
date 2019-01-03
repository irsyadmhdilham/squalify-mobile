import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";

import { ScoreboardProvider } from "../../../providers/scoreboard/scoreboard";
import { PointProvider } from "../../../providers/point/point";
import { SalesProvider } from "../../../providers/sales/sales";
import { pointScore, salesScore } from "../../../models/scoreboard";

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
  salesScorer: salesScore[] = [];
  pointScorer: pointScore[] = [];
  addPointListener: Subscription;
  subtractPointListener: Subscription;
  addSalesListener: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private scoreboardProvider: ScoreboardProvider,
    private actionSheetCtrl: ActionSheetController,
    private pointProvider: PointProvider,
    private salesProvider: SalesProvider
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

  fetchSalesScore(period, salesType) {
    this.pageStatus = 'loading';
    this.scoreboardProvider.getSalesScore(period, salesType).subscribe(sales => {
      this.pageStatus = undefined;
      this.salesScorer = sales;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  fetchPointScore(period) {
    this.pageStatus = 'loading';
    this.scoreboardProvider.getPointScore(period).subscribe(observe => {
      this.pageStatus = undefined;
      this.pointScorer = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  pointMutation() {
    this.addPointListener = this.pointProvider.addPoint$.subscribe(response => {
      if (this.pointScorer.length > 0) {
        const i = this.pointScorer.findIndex(val => val.pk === response.sender);
        this.pointScorer[i].point += response.point;
      }
    });

    this.subtractPointListener = this.pointProvider.subtractPoint$.subscribe(response => {
      if (this.pointScorer.length > 0) {
        const i = this.pointScorer.findIndex(val => val.pk === response.sender);
        this.pointScorer[i].point -= response.point;
      }
    });
  }

  salesMutatation() {
    this.addSalesListener = this.salesProvider.addSales$.subscribe(response => {
      if (this.salesScorer.length > 0) {
        const i = this.salesScorer.findIndex(val => val.pk === response.sender);
        this.salesScorer[i].amount += response.amount;
      }
    });
  }

  ionViewDidLoad() {
    this.fetchSalesScore('year', 'total');
    this.pointMutation();
    this.salesMutatation();
  }

  ionViewWillLeave() {
    this.addPointListener.unsubscribe();
    this.subtractPointListener.unsubscribe();
    this.addSalesListener.unsubscribe();
  }

}
