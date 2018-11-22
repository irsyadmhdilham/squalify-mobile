import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ModalController
} from 'ionic-angular';

import { schedule } from "../../../../interfaces/schedule";
import { ScheduleProvider } from "../../../../providers/schedule/schedule";
import { EditScheduleComponent } from "../../../../components/schedule/edit-schedule/edit-schedule";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private scheduleProvider: ScheduleProvider,
    private modalCtrl: ModalController
  ) { }

  editSchedule() {
    const modal = this.modalCtrl.create(EditScheduleComponent, {
      schedule: {
        pk: this.pk,
        title: this.title,
        location: this.location,
        remark: this.remark,
        date: this.date
      }
    });
    modal.present();
    modal.onDidDismiss((schedule: schedule) => {
      if (schedule) {
        this.date = schedule.date;
        this.title = schedule.title;
        this.location = schedule.location;
        this.remark = schedule.remark;
      }
    });
  }

  ionViewDidLoad() {
    const schedule: schedule = this.navParams.get('schedule');
    this.pk = schedule.pk;
    this.date = schedule.date;
    this.title = schedule.title;
    this.location = schedule.location;
    this.remark = schedule.remark;
    this.reminder = schedule.reminder;
  }

  remove() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    this.scheduleProvider.userId().then(userId => {
      loading.present();
      this.scheduleProvider.removeSchedule(userId, this.pk).subscribe(() => {
        loading.dismiss();
        this.navCtrl.pop();
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error occured',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      })
    });
  }

}
