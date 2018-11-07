import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettingsPage } from "./settings/settings";
import { PushNotificationsPage } from "./settings/push-notifications/push-notifications";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  name = 'Irsyad Mhd Ilham';
  designation = 'Group Agency Manager';
  agency = 'Vision Victory Empire';
  company = 'CWA';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  toSettings() {
    this.navCtrl.push(SettingsPage);
  }

  ionViewDidLoad() {
    this.navCtrl.push(PushNotificationsPage);
  }

}
