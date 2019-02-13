import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";

import { ContactsPage } from "./contacts/contacts";
import { SchedulesPage } from "./schedules/schedules";
import { PointsPage } from "./points/points";
import { SalesPage } from "./sales/sales";
import { GroupPage } from "./group/group";
import { AgencyPage } from "./agency/agency";
import { ScoreboardPage } from "./scoreboard/scoreboard";
import { NotificationsPage } from "../notifications/notifications";

import { PointProvider } from "../../providers/point/point";

import { point } from "../../models/point";
import { profile } from "../../models/profile";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  connected: boolean = true;
  todayPoint: point;
  profile: Observable<profile> = this.store.pipe(select('profile'));
  dontShowToast = true;
  notifications$ = this.store.pipe(select('notifications'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pointProvider: PointProvider,
    private alertCtrl: AlertController,
    private store: Store<profile>
  ) { }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  navigate(section) {
    switch (section) {
      case 'contacts':
        this.navCtrl.push(ContactsPage);
      break;
      case 'schedules':
        this.navCtrl.push(SchedulesPage);
      break;
      case 'points':
        this.navCtrl.push(PointsPage);
      break;
      case 'sales':
        this.navCtrl.push(SalesPage);
      break;
      case 'group':
        this.navCtrl.push(GroupPage);
      break;
      case 'agency':
        this.navCtrl.push(AgencyPage);
      break;
      case 'scoreboard':
        this.navCtrl.push(ScoreboardPage);
      break;
    }
  }

  ionViewWillEnter() {
    this.fetchTodayPoint();
  }

  fetchTodayPoint() {
    this.pointProvider.getTodayPoint().subscribe(observe => {
      this.todayPoint = observe[0];
    }, (err: Error) => {
      const alert = this.alertCtrl.create({
        title: 'Error has occured',
        subTitle: err.message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

}
