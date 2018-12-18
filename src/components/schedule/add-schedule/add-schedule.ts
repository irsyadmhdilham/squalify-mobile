import { Component } from '@angular/core';
import {
  ViewController,
  ModalController,
  AlertController,
  LoadingController,
  ToastController,
  NavParams
} from "ionic-angular";
import { take } from "rxjs/operators";
import * as moment from "moment";

import { CustomReminderComponent } from "../custom-reminder/custom-reminder";
import { ScheduleProvider } from "../../../providers/schedule/schedule";
import { PointProvider } from "../../../providers/point/point";
import { UpdatePoint } from "../../../providers/point/update-point";

import { contactPoints } from "../../../interfaces/point";

@Component({
  selector: 'add-schedule',
  templateUrl: 'add-schedule.html'
})
export class AddScheduleComponent {

  customReminder: { period: string; datetime: string; interval: string; };
  reminderEvery3Month: boolean;
  appointmentSecured: boolean;
  points: contactPoints;

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private scheduleProvider: ScheduleProvider,
    private toastCtrl: ToastController,
    private pointProvider: PointProvider,
    private navParams: NavParams
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
      const data = {
        title: title.value,
        date: moment(date.value, 'YYYY-MM-DD HH:mm:ss').toISOString(),
        location: location.value,
        remark: remark.value === '' ? null : remark.value
      };
      const userId = this.scheduleProvider.userId;
      if (this.appointmentSecured) {
        this.updatePoint().then(() => {
          this.addScheduleAction(data, loading, true);
        });
      } else {
        this.addScheduleAction(userId, data, loading);
      }
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Empty required field',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  addScheduleAction(data, loading, toast?) {
    this.scheduleProvider.addSchedule(data).pipe(take(1)).subscribe(observe => {
      loading.dismiss();
      if (toast) {
        const toast = this.toastCtrl.create({
          message: `Point added, Total Appointment secured point: ${this.points.app_sec.point + 2}`,
          position: 'top',
          duration: 1500
        });
        toast.present();
        toast.onDidDismiss(() => {
          this.viewCtrl.dismiss({
            schedule: observe
          });
        })
      } else {
        this.viewCtrl.dismiss({
          schedule: observe
        });
      }
    }, (err: Error) => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Error occured',
        subTitle: err.message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  updatePoint() {
    const points = this.points;
    const update = new UpdatePoint(
      this.pointProvider,
      points.pk,
      points.app_sec.point,
      'Appointment secured',
      points.app_sec.pk, 2);
    return new Promise((resolve, reject) => {
      update.add().then(snap => {
        resolve(snap);
      }).catch(err => reject(err));
    });
  }

  ionViewDidLoad() {
    this.pointProvider.getContactPoints().subscribe(observe => {
      this.points = observe;
    });
    const appSec = this.navParams.get('appointmentSecured');
    if (appSec) {
      this.appointmentSecured = appSec;
    }
  }

}
