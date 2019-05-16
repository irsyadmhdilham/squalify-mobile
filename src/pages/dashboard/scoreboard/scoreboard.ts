import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";

import { ScoreboardProvider } from "../../../providers/scoreboard/scoreboard";
import { PointProvider } from "../../../providers/point/point";
import { SalesProvider } from "../../../providers/sales/sales";
import { pointScore, salesScore } from "../../../models/scoreboard";
import { SalesDateComponent } from "../../../components/sales/sales-date/sales-date";

@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html',
})
export class ScoreboardPage {

  segment = 'sales';
  pageStatus: string;
  periodActive = false;
  salesType = 'sales type';
  salesTypeActive = false;
  period = 'period';
  salesScorer: salesScore[] = [];
  pointScorer: pointScore[] = [];
  addPointListener: Subscription;
  subtractPointListener: Subscription;
  addSalesListener: Subscription;
  dateSelect: { from: Date; until: Date; };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private scoreboardProvider: ScoreboardProvider,
    private actionSheetCtrl: ActionSheetController,
    private pointProvider: PointProvider,
    private salesProvider: SalesProvider,
    private modalCtrl: ModalController
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
      if (this.segment === 'sales') {
        this.fetchSalesScore();
      }
    });
  }

  selectPeriod() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select period',
      buttons: [
        { text: 'Year', handler: () => {
          this.period = 'year';
          this.periodActive = true;
          this.dateSelect = undefined;
          if (this.segment === 'sales') {
            this.fetchSalesScore();
          } else {
            this.fetchPointScore();
          }
        }},
        { text: 'Select date', handler: () => {
          const pickDate = this.modalCtrl.create(SalesDateComponent, { dateSelect: this.dateSelect });
          pickDate.present();
          pickDate.onDidDismiss((data: { from: Date; until: Date; }) => {
            if (data) {
              this.period = 'select date';
              this.dateSelect = data;
              this.periodActive = true;
              if (this.segment === 'sales') {
                this.fetchSalesScore();
              } else {
                this.fetchPointScore();
              }
            }
          });
        }},
        // { text: 'Month', handler: () => { this.period = 'month'; this.periodActive = true; }},
        // { text: 'Week', handler: () => { this.period = 'week'; this.periodActive = true; }},
        // { text: 'Today', handler: () => { this.period = 'today'; this.periodActive = true; }},
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    actionSheet.present();
  }

  segmentChanged(event) {
    const value = event.value;
    if (value === 'sales') {
      this.fetchSalesScore();
    } else {
      this.fetchPointScore();
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

  fetchSalesScore() {
    this.pageStatus = 'loading';
    const period = this.period,
          salesType = this.salesType;
    this.scoreboardProvider.getSalesScore(period, salesType, this.dateSelect).subscribe(sales => {
      this.pageStatus = undefined;
      this.salesScorer = sales;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  fetchPointScore() {
    this.pageStatus = 'loading';
    const period = this.period;
    this.scoreboardProvider.getPointScore(period, this.dateSelect).subscribe(observe => {
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
    this.fetchSalesScore();
    this.pointMutation();
    this.salesMutatation();
  }

  ionViewWillLeave() {
    this.addPointListener.unsubscribe();
    this.subtractPointListener.unsubscribe();
    this.addSalesListener.unsubscribe();
  }

}
