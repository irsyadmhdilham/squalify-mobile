import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";

import { point } from "../../../../interfaces/point";

@IonicPage()
@Component({
  selector: 'page-point-detail',
  templateUrl: 'point-detail.html',
})
export class PointDetailPage {

  date;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    const point: point = this.navParams.get('point');
    this.date = moment(point.date, 'YYYY-MM-DD');
  }

}
