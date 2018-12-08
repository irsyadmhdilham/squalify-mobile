import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EpfCalculatorPage } from "./epf-calculator/epf-calculator";
import { CashCalculatorPage } from "./cash-calculator/cash-calculator";
import { NotificationsPage } from "../notifications/notifications";

interface app {
  img: string;
  caption: string;
  component: any;
}

@IonicPage()
@Component({
  selector: 'page-applications',
  templateUrl: 'applications.html',
})
export class ApplicationsPage {

  apps: app[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.apps = [
      { img: '../../assets/imgs/apps/epf.png', caption: 'Unit trust EPF calculator', component: EpfCalculatorPage },
      { img: '../../assets/imgs/apps/cash.png', caption: 'Unit trust cash calculator', component: CashCalculatorPage }
    ];
  }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  navigate(page) {
    this.navCtrl.push(page.component);
  }

}
