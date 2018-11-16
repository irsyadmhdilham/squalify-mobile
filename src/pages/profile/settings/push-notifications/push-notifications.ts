import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { pushNotification } from "../../../../interfaces/profile-settings";

@IonicPage()
@Component({
  selector: 'page-push-notifications',
  templateUrl: 'push-notifications.html',
})
export class PushNotificationsPage {

  reminder: boolean;
  agencySales: boolean;
  mentions: boolean;
  directMessage: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    const pushNotification: pushNotification = this.navParams.get('pushNotification');
    this.directMessage = pushNotification.direct_message;
    this.mentions = pushNotification.mentions;
    this.agencySales = pushNotification.activities;
    this.reminder = pushNotification.reminder;
  }

}
