import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
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
  months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  month: string;
  monthActive = false;
  filtering: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private scheduleProvider: ScheduleProvider,
    private alertCtrl: AlertController
  ) { }

  showDate(item: schedule, i: number) {
    if (i > 0) {
      const upper = moment(this.schedules[i - 1].date).format('YYYY-MM-DD'),
            present = moment(item.date).format('YYYY-MM-DD');
      if (upper === present) {
        return { visibility: 'hidden' };
      }
      return false
    }
    return false
  }

  addMargin(item: schedule, i: number) {
    const x = this.schedules.length;
    if (i < x && i > 0) {
      const upper = moment(this.schedules[i - 1].date).format('YYYY-MM-DD'),
            present = moment(item.date).format('YYYY-MM-DD');
      if (upper !== present) {
        return { marginTop: '.8em' };
      }
      return false
    }
    return false
  }

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

  monthPartition(item: schedule, i: number) {
    if (i > 0) {
      const upper = moment(this.schedules[i - 1].date).format('MMMM'),
            present = moment(item.date).format('MMMM');
      if (upper !== present) {
        return true
      }
      return false
    }
    return false
  }

  monthName(item: schedule) {
    const present = moment(item.date).format('MMMM');
    return present;
  }

  fetch() {
    this.pageStatus = 'loading';
    this.scheduleProvider.getSchedules().subscribe(observe => {
      this.pageStatus = undefined;
      this.schedules = observe;
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

  filterMonth() {
    const monthSelect = this.alertCtrl.create({
      title: 'Select below',
      inputs: this.months.map((val, i) => {
        return {
          type: 'radio',
          label: val,
          value: i.toString(),
          checked: this.month === val
        };
      }),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Select',
          handler: (value: string) => {
            if (value) {
              this.month = this.months[parseInt(value)];
              this.pageStatus = 'loading';
              this.scheduleProvider.scheduleFilterMonth(value).subscribe(schedules => {
                this.pageStatus = undefined;
                this.filtering = true;
                this.monthActive = true;
                this.schedules = schedules;
              }, () => {
                this.pageStatus = undefined;
              });
            }
          }
        }
      ]
    });
    monthSelect.present();
  }

}
