import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, NavParams } from "ionic-angular";
import * as moment from "moment";

import { ScheduleProvider } from "../../../providers/schedule/schedule";

import { schedule } from "../../../interfaces/schedule";

@Component({
  selector: 'edit-schedule',
  templateUrl: 'edit-schedule.html'
})
export class EditScheduleComponent {

  pk: number;
  title: string;
  date: string;
  location: string;
  remark: string;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private scheduleProvider: ScheduleProvider,
    private navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    const schedule: schedule = this.navParams.get('schedule');
    const ins = schedule.date;
    let date = ins.getDate().toString(),
        month = (ins.getMonth() + 1).toString(),
        year = ins.getFullYear().toString(),
        hours = ins.getHours().toString(),
        minutes = ins.getMinutes().toString();
    if (month.length === 1) {
      month = `0${month}`;
    }
    if (hours.length === 1) {
      hours = `0${hours}`;
    }
    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }
    this.date = `${year}-${month}-${date}T${hours}:${minutes}`;
    this.pk = schedule.pk;
    this.title = schedule.title;
    this.location = schedule.location;
    this.remark = schedule.remark;
  }

  updateSchedule(title, location, remark, date) {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    try {
      if (!title.valid) {
        throw 'Please insert title';
      }
      if (!location.valid) {
        throw 'Please insert location';
      }
      if (!date.valid) {
        throw 'Please select date and time';
      }
      const data: schedule = {
        title: title.value,
        location: location.value,
        date: moment(date.value, moment.ISO_8601).toISOString(),
        remark: remark.value === '' ? null : remark.value
      };
      loading.present();
      this.scheduleProvider.userId().then(userId => {
        this.scheduleProvider.updateSchedule(userId, this.pk, data).subscribe(observe => {
          loading.dismiss();
          this.viewCtrl.dismiss(observe);
        });
      });
    } catch (err) {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Error occured',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
