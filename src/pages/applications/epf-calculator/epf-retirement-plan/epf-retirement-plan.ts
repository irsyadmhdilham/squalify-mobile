import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { futureValue } from "../../../../functions/future-value";

@IonicPage()
@Component({
  selector: 'page-epf-retirement-plan',
  templateUrl: 'epf-retirement-plan.html',
})
export class EpfRetirementPlanPage {

  presentAge = 0;
  desiredIncome = '';
  inflationRate = 4;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  presentIncome() {
    let value: number | string = 0;
    if (this.desiredIncome !== '') {
      value = parseFloat(this.desiredIncome);
    }
    return value;
  }

  presentToRetirement() {
    return 55 - this.presentAge;
  }

  requiredAmount() {
    let value: string | number = 0;
    if (this.desiredIncome !== '') {
      value = parseFloat(this.desiredIncome);
    }
    return value * 240;
  }

  amountAfterInflation() {
    const fv = futureValue(this.requiredAmount(), 0, this.inflationRate, 20);
    return parseFloat(fv);
  }

  ionViewDidLoad() {
    this.presentAge = this.navParams.get('age');
  }

}
