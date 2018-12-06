import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ScoreboardProvider } from "../../../providers/scoreboard/scoreboard";

@IonicPage()
@Component({
  selector: 'page-scoreboard',
  templateUrl: 'scoreboard.html',
})
export class ScoreboardPage {

  segment = 'sales';
  pageStatus: string;
  period = 'year';
  salesScorer = [];
  pointScorer = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private scoreboardProvider: ScoreboardProvider
  ) { }

  segmentChanged(event) {
    const value = event.value;
    if (value === 'sales') {
      if (this.salesScorer.length === 0 && this.pageStatus !== 'loading') {
        this.fetchSalesScore();
      }
    } else {
      if (this.pointScorer.length === 0 && this.pageStatus !== 'loading') {
        this.fetchPointScore();
      }
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

  async fetchSalesScore() {
    const userId = await this.scoreboardProvider.userId();
    this.pageStatus = 'loading';
    this.scoreboardProvider.getSalesScore(userId, this.period).subscribe(observe => {
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

  async fetchPointScore() {
    const userId = await this.scoreboardProvider.userId();
    this.pageStatus = 'loading';
    this.scoreboardProvider.getPointScore(userId, this.period).subscribe(observe => {
      this.pageStatus = undefined;
      this.pointScorer = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetchSalesScore();
  }

}
