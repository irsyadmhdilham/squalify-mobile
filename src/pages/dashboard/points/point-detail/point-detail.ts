import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Colors } from "../../../../functions/colors";
import { log } from "../../../../interfaces/point";

import { PointSummaryComponent } from "../../../../components/point/point-summary/point-summary";
import { PointProvider } from "../../../../providers/point/point";

@IonicPage()
@Component({
  selector: 'page-point-detail',
  templateUrl: 'point-detail.html',
})
export class PointDetailPage {

  pk: number
  date: Date;
  logs = [];
  productivePoints: number;
  careerPoints: number;
  total: number;
  pageStatus: string;
  point;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private pointProvider: PointProvider
  ) { }

  pointColor(log: log) {
    if (log.point_type === 'Add') {
      return { color: Colors.secondary };
    }
    return { color: Colors.danger };
  }

  showSummary() {
    const modal = this.modalCtrl.create(PointSummaryComponent, { point: this.point });
    modal.present();
  }

  fetch() {
    this.pageStatus = 'loading';
    this.pointProvider.getPointDetail(this.pk).subscribe(observe => {
      this.pageStatus = undefined;
      this.productivePoints = observe.productive_point;
      this.careerPoints = observe.career_point;
      this.total = observe.total;
      this.logs = observe.logs;
      this.date = new Date(observe.date);
      this.point = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    const pointId = this.navParams.get('pointId');
    this.pk = pointId;
    this.fetch();
  }

}
