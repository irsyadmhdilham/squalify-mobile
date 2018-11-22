import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ContactsPage } from "./contacts/contacts";
import { SchedulesPage } from "./schedules/schedules";

import { Subscription } from "rxjs/Subscription";
import { Network } from "@ionic-native/network";

import { schedule } from "../../interfaces/schedule";

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  connected: boolean = true;
  onConnect: Subscription;
  onDisconnected: Subscription;
  schedules: schedule[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private network: Network
  ) { }

  navigate(section) {
    switch (section) {
      case 'contacts':
        this.navCtrl.push(ContactsPage);
      break;
      case 'schedules':
        this.navCtrl.push(SchedulesPage);
      break;
    }
  }

  ionViewDidEnter() {
    this.onConnect = this.network.onConnect().subscribe(() => {
      this.connected = true;
    });
    this.onDisconnected = this.network.onDisconnect().subscribe(() => {
      this.connected = false;
    });
  }

  ionViewWillLeave() {
    this.onDisconnected.unsubscribe();
    this.onConnect.unsubscribe();
  }

}
