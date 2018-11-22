import { Component } from '@angular/core';
import { ViewController, ModalController, AlertController, LoadingController } from "ionic-angular";
import * as moment from "moment";

import { CustomReminderComponent } from "../custom-reminder/custom-reminder";
import { ScheduleProvider } from "../../../providers/schedule/schedule";

@Component({
  selector: 'add-schedule',
  templateUrl: 'add-schedule.html'
})
export class AddScheduleComponent {

  customReminder: { period: string; datetime: string; interval: string; };
  reminderEvery3Month: boolean;

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private scheduleProvider: ScheduleProvider
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  customReminderText() {
    if (this.customReminder) {
      const period = this.customReminder.period,
            datetime = this.customReminder.datetime,
            interval = this.customReminder.interval;
      const th = (date) => {
        date = parseInt(date);
        if (date === 1) {
          return 'st';
        } else if (date === 2) {
          return 'nd';
        } else if (date === 3) {
          return 'rd';
        } else {
          return 'th';
        }
      };
      if (period === 'Year') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = datetime.match(/^\d{1,2}/).toString(),
              month = parseInt(datetime.match(/\/\d{1,2}\//g).toString().replace(/\//g, ''));
        return `Every ${interval} ${period.toLowerCase()}, ${date}${th(datetime)} ${months[month]}`;
      } else if (period === 'Month') {
        return `Every ${interval} ${period.toLowerCase()}, on ${datetime}${th(datetime)}`
      } else if (period === 'Week') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return `Every ${days[parseInt(datetime)]} of the week`;
      } else {
        return `Every time: ${datetime}`;
      }
    }
  }

  createCustomReminder() {
    const modal = this.modalCtrl.create(CustomReminderComponent);
    modal.present();
    modal.onDidDismiss(reminder => {
      this.customReminder = reminder
    });
  }

  addSchedule(title, date, location, remark) {
    const loading = this.loadingCtrl.create({ content: 'Please wait...' });
    try {
      if (!title.valid) {
        throw 'Please insert title';
      }
      if (!date.valid) {
        throw 'Please insert date';
      }
      if (!location.valid) {
        throw 'Please insert location';
      }
      loading.present();
      this.scheduleProvider.userId().then(userId => {
        const data = {
          title: title.value,
          date: moment(date.value, 'YYYY-MM-DD HH:mm:ss').toISOString(),
          location: location.value,
          remark: remark.value === '' ? null : remark.value
        };
        this.scheduleProvider.addSchedule(userId, data).subscribe(observe => {
          loading.dismiss();
          this.viewCtrl.dismiss({
            schedule: observe
          })
        }, (err: Error) => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error occured',
            subTitle: err.message,
            buttons: ['Ok']
          });
          alert.present();
        });
      });
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Empty required field',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
