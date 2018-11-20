import { Component } from '@angular/core';
import { ViewController, AlertController } from "ionic-angular";

@Component({
  selector: 'custom-reminder',
  templateUrl: 'custom-reminder.html'
})
export class CustomReminderComponent {

  period: string;
  frequencies = [];
  dates = [];
  interval: string;
  date: string;
  month: string;
  day: string;
  time: string;

  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController) { }

  frequencyText(value) {
    if (this.period === 'Month') {
      return `${value} month`;
    }
    return `${value} year`;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addReminder(periodNgModel) {
    if (!periodNgModel.valid) {
      const alert = this.alertCtrl.create({
        title: 'Empty required fields',
        subTitle: 'Please select period',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    let datetime: any;
    if (this.period === 'Year') {
      const setDateMonth = new Date(null, parseInt(this.month), parseInt(this.date)).toLocaleDateString()
      datetime = setDateMonth;
    } else if (this.period === 'Month') {
      datetime = this.date;
    } else if (this.period === 'Week') {
      datetime = this.day;
    } else {
      datetime = this.time;
    }
    this.viewCtrl.dismiss({
      period: this.period,
      datetime,
      interval: this.interval
    });
  }

  ionViewDidLoad() {
    for (let x = 1; x < 101; x++) {
      this.frequencies.push(x);
    }
    for (let x = 1; x < 32; x++) {
      this.dates.push(x);
    }
    const instance = new Date(),
          month = instance.getMonth(),
          date = instance.getDate(),
          hours = instance.getHours(),
          minutes = instance.getMinutes(),
          day = instance.getDay();
    this.date = date.toString();
    this.month = month.toString();
    this.interval = '1';
    this.time = `${hours}:${minutes}`;
    this.day = day.toString();
  }

}
