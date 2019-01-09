import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Store, select } from "@ngrx/store";

import { EpfCalculatorPage } from "./epf-calculator/epf-calculator";
import { CashCalculatorPage } from "./cash-calculator/cash-calculator";
import { NotificationsPage } from "../notifications/notifications";

interface app {
  img: string;
  caption: string;
  component: any;
}

import { store } from "../../models/store";

@Component({
  selector: 'page-applications',
  templateUrl: 'applications.html',
})
export class ApplicationsPage {

  apps: app[];
  notifications$ = this.store.pipe(select('notifications'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<store>
  ) {
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
