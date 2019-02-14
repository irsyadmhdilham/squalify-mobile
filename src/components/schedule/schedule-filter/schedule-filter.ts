import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from "ionic-angular";

import { filterData } from "../../../models/schedule";

@Component({
  selector: 'schedule-filter',
  templateUrl: 'schedule-filter.html'
})
export class ScheduleFilterComponent {

  title: string;
  location: string;
  remark: string;
  dateFrom: string;
  dateUntil: string;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private alertCtrl: AlertController) { }

  ionViewDidLoad() {
    const data: filterData = this.navParams.get('data');
    if (data) {
      if (data.title) this.title = data.title;
      if (data.location) this.location = data.location;
      if (data.date) {
        if (data.date.from) this.dateFrom = data.date.from;
        if (data.date.until) this.dateUntil = data.date.until;
      }
    }
  }

  clear() {
    this.title = '';
    this.remark = '';
    this.location = '';
    this.dateFrom = '';
    this.dateUntil = '';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  filter() {
    let title = this.title,
        location = this.location,
        remark = this.remark,
        from = this.dateFrom,
        until = this.dateUntil;
    if (title === '') title = undefined;
    if (location === '') location = undefined;
    if (remark === '') remark = undefined;
    if (from === '') from = undefined;
    if (until === '') until = undefined;
    if (this.dateFrom !== undefined && this.dateUntil === undefined) {
      const alert = this.alertCtrl.create({title: 'Required field', subTitle: 'Please select date until', buttons: ['Ok']});
      alert.present();
      return;
    }
    if (this.dateFrom === undefined && this.dateUntil !== undefined) {
      const alert = this.alertCtrl.create({title: 'Required field', subTitle: 'Please select date from', buttons: ['Ok']});
      alert.present();
      return;
    }
    this.viewCtrl.dismiss({
      title,
      remark,
      location,
      date: { from, until }
    });
  }

}
