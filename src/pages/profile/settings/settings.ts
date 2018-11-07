import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PushNotificationsPage } from "./push-notifications/push-notifications";
import { Colors } from "../../../functions/colors";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  emailNotification: boolean;
  socialNetwork = {
    facebook: 'metal_ibanez@hotmail.com',
    google: null,
    dropbox: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.emailNotification = true;
  }

  pushNotifications() {
    this.navCtrl.push(PushNotificationsPage);
  }

  socialNetworkStyle(account) {
    if (!account) {
      return Colors.primary;
    }
    return Colors.dark;
  }

}
