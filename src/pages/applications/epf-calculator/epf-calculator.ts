import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EpfElaborationPage } from "./epf-elaboration/epf-elaboration";
const epfSchemes = require('../../../assets/epf-schemes.json');

import { roundDecimal } from '../../../functions/number-commas';


@IonicPage()
@Component({
  selector: 'page-epf-calculator',
  templateUrl: 'epf-calculator.html',
})
export class EpfCalculatorPage {

  accountOne: string;
  age: string;
  saving: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  toElaborate() {
    this.navCtrl.push(EpfElaborationPage);
  }

  basicSaving() {
    const age = parseInt(this.age);
    const saving = epfSchemes.filter(val => {
      return val.age === age;
    });
    if (saving.length === 0 || saving.length > 1 || !this.accountOne || this.accountOne === '') {
      this.saving = 0;
      return 0;
    }
    this.saving = saving[0].saving;
    return roundDecimal(saving[0].saving);
  }

  total() {
    const accountOne = isNaN(parseFloat(this.accountOne)) ? 0 : parseFloat(this.accountOne);
    if (!this.age || this.age === '' || !this.accountOne || this.accountOne === '') {
      return 0;
    }
    return roundDecimal(( accountOne - this.saving ) * 0.3);
  }

}
