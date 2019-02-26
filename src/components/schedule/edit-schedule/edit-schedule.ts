import { Component, DoCheck } from '@angular/core';
import { ViewController, AlertController, LoadingController, NavParams, Platform } from "ionic-angular";
import { LocalNotifications } from "@ionic-native/local-notifications";
import * as moment from "moment";

import { ScheduleProvider } from "../../../providers/schedule/schedule";

import { schedule } from "../../../models/schedule";

type reminder = schedule & { reminderDate: Date };

@Component({
  selector: 'edit-schedule',
  templateUrl: 'edit-schedule.html'
})
export class EditScheduleComponent implements DoCheck {

  pk: number;
  title: string;
  date: string;
  location: string;
  remark: string;
  reminderDate: string;
  reminderSelect: string;
  reminderUpdate: boolean;
  reminderClear: boolean;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private scheduleProvider: ScheduleProvider,
    private navParams: NavParams,
    private platform: Platform,
    private localNotifications: LocalNotifications
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  clearReminder() {
    this.reminderDate = '';
    this.reminderSelect = '';
    this.reminderUpdate = false;
    this.reminderClear = true;
  }

  ngDoCheck() {
    if (this.reminderDate === '' && this.reminderSelect === '' && !this.reminderUpdate) {
      setTimeout(() => {
        this.reminderDate = undefined;
        this.reminderSelect = undefined;
      }, 300);
    }
  }

  ionViewDidLoad() {
    const schedule: reminder = this.navParams.get('schedule');
    this.date = moment(schedule.date).format('YYYY-MM-DDTHH:mm');
    this.reminderUpdate = schedule.reminder ? true : false;
    this.reminderDate = schedule.reminderDate ? moment(schedule.reminderDate).format('YYYY-MM-DDTHH:mm') : undefined;
    this.reminderSelect = (() => {
      if (schedule.reminder) {
        switch(schedule.reminder) {
          case '30 minutes before':
            return schedule.reminder;
          case 'An hour before':
            return schedule.reminder;
          case '2 hours before':
            return schedule.reminder;
          case 'A day before':
            return schedule.reminder;
          case '2 days before':
            return schedule.reminder;
          case 'A week before':
            return schedule.reminder;
          default:
            return 'Other';
        }
      }
      return null;
    })()
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
      const data = {
        title: title.value,
        location: location.value,
        date: moment(date.value, 'YYYY-MM-DD HH:mm:ss').toDate(),
        remark: remark.value === '' ? null : remark.value,
        clearReminder: this.reminderClear,
        reminderDate: (() => {
          if (this.reminderSelect) {
            if (this.reminderSelect === 'Other') {
              if (!this.reminderDate || this.reminderDate === '') {
                throw 'Please pick reminder date';
              }
              return moment(this.reminderDate, 'YYYY-MM-DD HH:mm:ss').toDate()
            }
            return this.reminderSelect;
          }
          return null;
        })()
      };
      loading.present();
      this.scheduleProvider.updateSchedule(this.pk, data).subscribe(observe => {
        loading.dismiss();
        this.setLocalNotification(observe.reminder, observe.date);
        this.viewCtrl.dismiss(observe);
      });
    } catch (err) {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  async setLocalNotification(reminder: Date, date: Date) {
    const isMobile = this.platform.is('mobile'),
          isCordova = this.platform.is('cordova');
    if (isMobile && isCordova) {
      const isScheduled = await this.localNotifications.isScheduled(this.pk);
      //remove reminder from cleared schedule
      if (!reminder && isScheduled) {
        this.localNotifications.clear(this.pk);
      }
      //update schedule if exists, if not exists create new
      if (isScheduled && reminder) {
        this.localNotifications.update({
          id: this.pk,
          title: `Reminder: ${this.title}`,
          text: moment(date).format('ddd, D MMM YYYY, h:mma'),
          trigger: { at: reminder }
        });
      } else if (reminder) {
        this.localNotifications.schedule({
          id: this.pk,
          title: `Reminder: ${this.title}`,
          text: moment(date).format('ddd, D MMM YYYY, h:mma'),
          trigger: { at: reminder }
        });
      }
    }
  }

}
