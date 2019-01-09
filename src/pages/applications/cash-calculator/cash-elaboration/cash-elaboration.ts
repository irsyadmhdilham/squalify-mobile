import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { futureValue } from "../../../../functions/future-value";

@Component({
  selector: 'page-cash-elaboration',
  templateUrl: 'cash-elaboration.html',
})
export class CashElaborationPage {

  presentValue = 0;
  rate = 6;
  rates: number[] = [6, 8, 10, 12];
  duration = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.presentValue = this.navParams.get('principal');
    this.duration = this.navParams.get('duration');
  }

  rateActive(rate) {
    if (rate === this.rate) {
      return 'white';
    } else {
      return 'dark';
    }
  }

  active(rate) {
    if (rate !== this.rate) {
      return false;
    }
    return true;
  }

  rateSelect(rate) {
    this.rate = rate;
  }

  futureValue() {
    const fv = futureValue(this.presentValue, 0, this.rate, this.duration);
    return parseFloat(fv);
  }

}
