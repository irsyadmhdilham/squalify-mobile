import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ModalController
} from 'ionic-angular';

import { schedule } from "../../../../models/schedule";
import { contact } from "../../../../models/contact";
import { ScheduleProvider } from "../../../../providers/schedule/schedule";
import { EditScheduleComponent } from "../../../../components/schedule/edit-schedule/edit-schedule";
import { ContactDetailPage } from "../../contacts/contact-detail/contact-detail";

@IonicPage()
@Component({
  selector: 'page-schedule-detail',
  templateUrl: 'schedule-detail.html',
})
export class ScheduleDetailPage {

  pk: number;
  date: Date;
  title: string;
  location: string;
  remark?: string;
  reminder: any;
  pageStatus: string;
  contact: contact;
  from = 'schedule';

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

  getDetail() {
    this.pageStatus = 'loading';
    this.scheduleProvider.getScheduleDetail(this.pk).subscribe(observe => {
      this.pageStatus = undefined;
      this.date = new Date(observe.date);
      this.title = observe.title;
      this.location = observe.location;
      this.remark = observe.remark;
      this.reminder = observe.reminder;
      if (observe.contact) {
        this.contact = observe.contact;
      }
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    const scheduleId = this.navParams.get('scheduleId'),
          from = this.navParams.get('from');
    if (from === 'contact') {
      this.from = 'contact';
    }
    this.pk = scheduleId;
    this.getDetail();
  }

  remove() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.scheduleProvider.removeSchedule(this.pk).subscribe(() => {
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
  }

  openContact(id: number) {
    this.navCtrl.push(ContactDetailPage, {
      contactId: id,
      from: 'schedule'
    });
  }

}
