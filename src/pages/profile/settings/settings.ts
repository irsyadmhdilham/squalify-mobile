import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PushNotificationsPage } from "./push-notifications/push-notifications";
import { Colors } from "../../../functions/colors";
import { settings, socialNetAcc, pushNotification } from "../../../interfaces/profile-settings";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  emailNotification: boolean;
  socialNetwork: socialNetAcc = {
    facebook: null,
    google: null,
    dropbox: null
  };
  pushNotification: pushNotification;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  pushNotifications() {
    this.navCtrl.push(PushNotificationsPage, { pushNotification: this.pushNotification });
  }

  socialNetworkStyle(account) {
    if (!account) {
      return Colors.primary;
    }
    return Colors.dark;
  }

  ionViewDidLoad() {
    const settings: settings = this.navParams.get('settings');
    this.socialNetwork = settings.social_net_acc;
    this.emailNotification = settings.notifications.email_notification;
    this.pushNotification = settings.notifications.push_notification;
  }

}
