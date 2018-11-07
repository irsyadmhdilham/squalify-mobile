import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-push-notifications',
  templateUrl: 'push-notifications.html',
})
export class PushNotificationsPage {

  schedule: boolean;
  agencySales: boolean;
  mentions: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.schedule = true;
    this.agencySales = true;
    this.mentions = true;
  }

}
