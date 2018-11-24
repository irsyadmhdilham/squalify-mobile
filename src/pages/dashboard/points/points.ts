import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { PointProvider } from "../../../providers/point/point";
import { point } from "../../../interfaces/point";
import * as moment from "moment";

import { PointDetailPage } from "./point-detail/point-detail";

@IonicPage()
@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})
export class PointsPage {

  pageStatus: string;
  page = 'personal';
  points: point[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pointProvider: PointProvider,
    private alertCtrl: AlertController
  ) { }

  async fetch() {
    const userId = await this.pointProvider.userId();
    this.pageStatus = 'loading';
    this.pointProvider.getPoints(userId).subscribe(observe => {
      this.pageStatus = undefined;
      this.points = observe;
    }, () => {
      const alert = this.alertCtrl.create({
        title: 'Error has occured',
        subTitle: 'Failed to retrieve points',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  totalPoint(point: point) {
    const total = point.attributes.map(val => val.point).reduce((a, b) => a + b);
    return total;
  }

  date(value: string) {
    return moment(value, 'YYYY-MM-DD');
  }

  ionViewDidLoad() {
    this.fetch();
  }

  navigate(point: point) {
    this.navCtrl.push(PointDetailPage, { point });
  }
}
