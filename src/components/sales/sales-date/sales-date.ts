import { Component } from '@angular/core';
import { ViewController, AlertController, NavParams } from "ionic-angular";
import * as moment from "moment";

@Component({
  selector: 'sales-date',
  templateUrl: 'sales-date.html'
})
export class SalesDateComponent {

  from: string;
  until: string;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private navParams: NavParams
  ) { }

  ionViewDidLoad() {
    const dateSelect: {from: Date; until: Date;} = this.navParams.get('dateSelect');
    if (dateSelect) {
      this.from = moment(dateSelect.from).format('YYYY-MM-DD');
      this.until = moment(dateSelect.until).format('YYYY-MM-DD');
    }
  }

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
