import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PushNotificationsPage } from "./push-notifications/push-notifications";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  emailNotification: boolean;
  socialNetwork = {
    facebook: '',
    google: '',
    dropbox: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  pushNotifications() {
    this.navCtrl.push(PushNotificationsPage);
  }

}
