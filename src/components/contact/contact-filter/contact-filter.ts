import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from "ionic-angular";

interface data {
  contactStatus?: string;
  contactType?: string;
  date?: { from: string; until: string; };
  name: string;
  answered?: string
}

@Component({
  selector: 'contact-filter',
  templateUrl: 'contact-filter.html'
})
export class ContactFilterComponent {

  segment: string = this.navParams.get('segment');
  name: string;
  contactStatus: string;
  contactType: string;
  answerStatus: string;
  dateFrom: string;
  dateUntil: string;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private alertCtrl: AlertController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  clear() {
    this.name = '';
    this.contactStatus = '';
    this.contactType = '';
    this.answerStatus = '';
    this.dateFrom = '';
    this.dateUntil = '';
  }

  filter() {
    let contactType = this.contactType,
        contactStatus = this.contactStatus,
        name = this.name,
        dateFrom = this.dateFrom,
        dateUntil = this.dateUntil,
        answered = this.answerStatus;
    if (contactStatus === '') contactStatus = undefined;
    if (contactType === '') contactType = undefined;
    if (name === '') name = undefined;
    if (dateFrom === '') dateFrom = undefined;
    if (dateUntil === '') dateUntil = undefined;
    if (answered === '') answered = undefined;
    if (this.segment === 'contacts') {
      this.viewCtrl.dismiss({
        segment: 'contacts',
        contactType,
        contactStatus,
        name
      });
    } else {
      if (dateFrom !== undefined && dateUntil === undefined) {
        const alert = this.alertCtrl.create({title: 'Required field', subTitle: 'Please select date until', buttons: ['Ok']});
        alert.present();
        return;
      }
      if (dateFrom === undefined && dateUntil !== undefined) {
        const alert = this.alertCtrl.create({title: 'Required field', subTitle: 'Please select date from', buttons: ['Ok']});
        alert.present();
        return;
      }
      this.viewCtrl.dismiss({
        segment: 'call logs',
        answered,
        date: { from: dateFrom, until: dateUntil },
        name: name
      });
    }
  }

  ionViewDidLoad() {
    const data: data = this.navParams.get('data');
    if (data) {
      if (data.contactStatus) this.contactStatus = data.contactStatus;
      if (data.contactType) this.contactType = data.contactType;
      if (data.name) this.name = data.name;
      if (data.date) {
        if (data.date.from) this.dateFrom = data.date.from;
        if (data.date.until) this.dateUntil = data.date.until;
      }
      if (data.answered) this.answerStatus = data.answered;
    }
  }

}
