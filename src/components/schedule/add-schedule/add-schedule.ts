import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

@Component({
  selector: 'add-schedule',
  templateUrl: 'add-schedule.html'
})
export class AddScheduleComponent {

  date: string;
  everyHowMany: number[] = [];

  constructor(private viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    for (let x = 0; x < 400; x++) {
      this.everyHowMany.push(x)
    }
  }

}
