import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EpfRetirementPlanPage } from "../epf-retirement-plan/epf-retirement-plan";

@Component({
  selector: 'page-epf-elaboration',
  templateUrl: 'epf-elaboration.html',
})
export class EpfElaborationPage {

  rate = 6;
  rates: number[] = [6, 8, 10, 12];
  presentAge = 0;
  presentValue = 0;
  showFV = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  presentToRetirement() {
    return 55 - this.presentAge;
  }

  _showFV() {
    this.showFV = true;
  }

  rateActive(rate) {
    if (rate === this.rate) {
      return 'white';
    } else {
      return 'dark';
    }
  }

  rateSelect(rate) {
    this.rate = rate;
  }

  active(rate) {
    if (rate !== this.rate) {
      return false;
    }
    return true;
  }

  ionViewDidLoad() {
    const age = this.navParams.get('age'),
          presentValue = this.navParams.get('presentValue');
    this.presentAge = age;
    this.presentValue = presentValue;
  }

  futureValue() {
    const rate = (1 + (this.rate / 100)),
          power = Math.pow(rate, ( 55 - this.presentAge)),
          result = Math.round(this.presentValue * power);
    return result;
  }

  toRetirementPlan() {
    this.navCtrl.push(EpfRetirementPlanPage, {
      age: this.presentAge
    });
  }

}
