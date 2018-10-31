import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { schedule } from "../../interfaces/schedule";

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  schedules: schedule[] = [
    {id: '1', title: 'Agency meeting', date: new Date(), location: 'KL'},
    {id: '1', title: 'Agency meeting', date: new Date(), location: 'KL'},
    {id: '1', title: 'Agency meeting', date: new Date(), location: 'KL'},
    {id: '1', title: 'Agency meeting', date: new Date(), location: 'KL'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  navigate(event) {
  }

}
