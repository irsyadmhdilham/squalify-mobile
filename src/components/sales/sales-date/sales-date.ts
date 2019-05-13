import { Component } from '@angular/core';
import { ViewController, AlertController } from "ionic-angular";
import * as moment from "moment";

@Component({
  selector: 'sales-date',
  templateUrl: 'sales-date.html'
})
export class SalesDateComponent {

  from: string;
  until: string;

  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController) { }

  cancel() {
    this.viewCtrl.dismiss();
  }

  submit() {
    if (!this.from || !this.until) {
      const alert = this.alertCtrl.create({
        title: 'Empty required fields',
        subTitle: 'Please select both from and until fields',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    const from = moment(this.from, 'YYYY-MM-DD').toDate(),
          until = moment(this.until, 'YYYY-MM-DD').toDate();
    this.viewCtrl.dismiss({ from, until });
  }

}
