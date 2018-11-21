import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController } from "ionic-angular";

import { ScheduleProvider } from "../../../providers/schedule/schedule";

import { schedule } from "../../../interfaces/schedule";

@Component({
  selector: 'edit-schedule',
  templateUrl: 'edit-schedule.html'
})
export class EditScheduleComponent {

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private scheduleProvider: ScheduleProvider
  ) { }

  

}
