import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { schedule } from "../../../../interfaces/schedule";

@IonicPage()
@Component({
  selector: 'page-schedule-detail',
  templateUrl: 'schedule-detail.html',
})
export class ScheduleDetailPage {

  pk: number;
  date: any;
  title: string;
  location: string;
  remark?: string;
  reminder: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    const schedule: schedule = this.navParams.get('schedule');
    this.pk = schedule.pk;
    this.date = schedule.date;
    this.title = schedule.title;
    this.location = schedule.location;
    this.remark = schedule.remark;
    this.reminder = schedule.reminder;
  }

}
