import { Component } from '@angular/core';
import {
  ViewController,
  AlertController,
  LoadingController,
  ToastController,
  NavParams,
  Platform
} from "ionic-angular";
import { LocalNotifications } from "@ionic-native/local-notifications";
import * as moment from "moment";

import { ScheduleProvider } from "../../../providers/schedule/schedule";
import { PointProvider } from "../../../providers/point/point";
import { UpdatePoint } from "../../../providers/point/update-point";

import { contactPoints } from "../../../models/point";

@Component({
  selector: 'add-schedule',
  templateUrl: 'add-schedule.html'
})
export class AddScheduleComponent {

  appointmentSecured: boolean;
  points: contactPoints;
  reminder: string;
  reminderDate: string;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private scheduleProvider: ScheduleProvider,
    private toastCtrl: ToastController,
    private pointProvider: PointProvider,
    private navParams: NavParams,
    private localNotifications: LocalNotifications,
    private platform: Platform
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async addSchedule(title, date, location, remark) {
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
        date: moment(date.value, 'YYYY-MM-DD HH:mm:ss').toDate(),
        location: location.value,
        remark: remark.value === '' ? null : remark.value,
        reminderDate: (() => {
          if (this.reminder !== 'Other') {
            return this.reminder;
          }
          if (!this.reminderDate || this.reminderDate === '') {
            const alert = this.alertCtrl.create({title: 'Required field', subTitle: 'Please pick date', buttons: ['Ok']});
            alert.present();
            return;
          }
          return moment(this.reminderDate, 'YYYY-MM-DD HH:mm:ss').toDate()
        })()
      };
      if (this.appointmentSecured) {
        this.updatePoint().then(() => {
          this.addScheduleAction(data, loading, true);
        });
      } else {
        this.addScheduleAction(data, loading);
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
    this.scheduleProvider.addSchedule(data).subscribe(observe => {
      loading.dismiss();
      if (observe.reminder) {
        this.setNotification(observe.pk, observe.title, observe.date, observe.reminder);
      }
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

  setNotification(id: number, title: string, date: Date, triggerAt: Date) {
    const isMobile = this.platform.is('mobile'),
          isCordova = this.platform.is('cordova');
    if (isMobile && isCordova) {
      const text = moment(date).format('ddd, D MMM YYYY, h:mma');
      this.platform.ready().then(() => {
        this.localNotifications.schedule({
          id,
          title: `Reminder: ${title}`,
          text,
          trigger: { at: triggerAt }
        });
      });
    }
  }

}
