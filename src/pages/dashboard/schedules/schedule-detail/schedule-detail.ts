import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ModalController,
  Platform
} from 'ionic-angular';
import * as moment from "moment";
import { Clipboard } from "@ionic-native/clipboard";

import { schedule } from "../../../../models/schedule";
import { contact } from "../../../../models/contact";
import { ScheduleProvider } from "../../../../providers/schedule/schedule";
import { EditScheduleComponent } from "../../../../components/schedule/edit-schedule/edit-schedule";
import { ContactDetailPage } from "../../contacts/contact-detail/contact-detail";

@Component({
  selector: 'page-schedule-detail',
  templateUrl: 'schedule-detail.html',
})
export class ScheduleDetailPage {

  pk: number;
  date: Date | string;
  title: string;
  location: string;
  remark?: string;
  reminder: string;
  reminderDate: Date;
  pageStatus: string;
  contact: contact;
  from = 'schedule';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private scheduleProvider: ScheduleProvider,
    private modalCtrl: ModalController,
    private clipboard: Clipboard,
    private platform: Platform
  ) {
    moment.updateLocale('en', {
      relativeTime: {
        future: "%s before",
        past: "%s ago",
        s  : 'a few seconds',
        ss : '%d seconds',
        m:  "a minute",
        mm: "%d minutes",
        h:  "An hour",
        hh: "%d hours",
        d:  "A day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
      }
    });
  }

  editSchedule() {
    const modal = this.modalCtrl.create(EditScheduleComponent, {
      schedule: {
        pk: this.pk,
        title: this.title,
        location: this.location,
        remark: this.remark,
        date: this.date,
        reminder: this.reminder,
        reminderDate: this.reminderDate
      }
    });
    modal.present();
    modal.onDidDismiss((schedule: schedule) => {
      if (schedule) {
        this.date = schedule.date;
        this.title = schedule.title;
        this.location = schedule.location;
        this.remark = schedule.remark;
        if (schedule.reminder) {
          this.reminderDate = schedule.reminder;
          const difference = moment(schedule.reminder).to(this.date);
          switch(difference) {
            case '30 minutes before':
              this.reminder = difference;
            case 'An hour before':
              this.reminder = difference;
            case '2 hours before':
              this.reminder = difference;
            case 'A day before':
              this.reminder = difference;
            case '2 days before':
              this.reminder = difference;
            break;
            case '7 days before':
              this.reminder = 'A week before';
            break;
            default:
              this.reminder = moment(schedule.reminder).format('ddd, DD MMM YYYY, hh:mma');
            break;
          }
        } else {
          this.reminder = null;
          this.reminderDate = null;
        }
      }
    });
  }

  getDetail() {
    this.pageStatus = 'loading';
    this.scheduleProvider.getScheduleDetail(this.pk).subscribe(observe => {
      this.pageStatus = undefined;
      this.date = observe.date;
      this.title = observe.title;
      this.location = observe.location;
      this.remark = observe.remark;
      this.reminderDate = observe.reminder;
      this.reminder = (() => {
        const reminder = observe.reminder;
        if (reminder) {
          const difference = moment(reminder).to(this.date);
          switch(difference) {
            case '30 minutes before':
              return difference;
            case 'An hour before':
              return difference;
            case '2 hours before':
              return difference;
            case 'A day before':
              return difference;
            case '2 days before':
              return difference;
            case '7 days before':
              return 'A week before';
            default:
              return moment(reminder).format('ddd, DD MMM YYYY, hh:mma');
          }
        }
        return null;
      })();
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

  copyClipboard(text: string) {
    const isMobile = this.platform.is('mobile'),
          isCordova = this.platform.is('cordova');
    if (isCordova && isMobile) {
      this.clipboard.copy(text);
    }
  }

}
