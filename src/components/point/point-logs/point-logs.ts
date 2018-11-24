import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

import { PointProvider } from "../../../providers/point/point";

@Component({
  selector: 'point-logs',
  templateUrl: 'point-logs.html'
})
export class PointLogsComponent {

  screenStatus: string;
  logs = [];

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private pointProvider: PointProvider
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async fetch() {
    this.screenStatus = 'loading';
    const userId = await this.pointProvider.userId();
    const pk = this.navParams.get('pk');
    this.pointProvider.getPointLogs(userId, pk).subscribe(observe => {
      this.screenStatus = undefined;
      this.logs = observe.logs.logs.map(val => {
        return {
          ...val,
          time: new Date(val.time)
        };
      });
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
