import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import * as moment from "moment";

import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";
import { ScheduleFilterComponent } from "../../../components/schedule/schedule-filter/schedule-filter";
import { ScheduleDetailPage } from "./schedule-detail/schedule-detail";
import { ScheduleProvider } from "../../../providers/schedule/schedule";

import { schedule, filterData } from "../../../models/schedule";

@Component({
  selector: 'page-schedules',
  templateUrl: 'schedules.html',
})
export class SchedulesPage {

  schedules: schedule[] = [];
  pageStatus: string;
  filterData: filterData;
  notFound: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private scheduleProvider: ScheduleProvider
  ) { }

  addSchedule() {
    const modal = this.modalCtrl.create(AddScheduleComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.pageStatus = undefined;
        this.schedules.push(data.schedule);
      }
    });
  }

  fetch() {
    this.pageStatus = 'loading';
    this.scheduleProvider.getSchedules().subscribe(observe => {
      this.pageStatus = undefined;
      this.schedules = observe.map(val => {
        return {
          ...val,
          date: new Date(val.date)
        }
      });
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewWillEnter() {
    this.fetch();
  }

  showDetail(schedule) {
    this.navCtrl.push(ScheduleDetailPage, { scheduleId: schedule.pk });
  }

  filter() {
    const modal = this.modalCtrl.create(ScheduleFilterComponent, { data: this.filterData });
    modal.present();
    modal.onDidDismiss((data: filterData) => {
      if (data) {
        this.filterData = data;
        this.pageStatus = 'loading';
        const from = moment(data.date.from, 'YYYY-MM-DD HH:mm:ss').toISOString(),
              until = moment(data.date.until, 'YYYY-MM-DD HH:mm:ss').toISOString();
        this.scheduleProvider.filterSchedule(data.title, data.location, data.remark, from, until).subscribe(schedules => {
          this.pageStatus = undefined;
          if (schedules.length === 0) {
            this.notFound = true;
          } else {
            this.notFound = false;
            this.schedules = schedules;
          }
        }, () => {
          this.pageStatus = undefined;
          this.notFound = false;
        });
      }
    });
  }

}
