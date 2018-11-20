import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AddScheduleComponent } from "../../../components/schedule/add-schedule/add-schedule";

@IonicPage()
@Component({
  selector: 'page-schedules',
  templateUrl: 'schedules.html',
})
export class SchedulesPage {

  schedules = [];
  pageStatus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) { }

  addSchedule() {
    const modal = this.modalCtrl.create(AddScheduleComponent);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.pageStatus = undefined;
        this.schedules.push(data.newSchedule);
      }
    });
  }

  ionViewDidLoad() {
    this.addSchedule();
  }

}
