import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Keyboard } from 'ionic-angular';

import { EpfElaborationPage } from "./epf-elaboration/epf-elaboration";
const epfSchemes = require('../../../assets/epf-schemes.json');

import { roundDecimal } from '../../../functions/number-commas';

@Component({
  selector: 'page-epf-calculator',
  templateUrl: 'epf-calculator.html',
})
export class EpfCalculatorPage {

  accountOne: string;
  age: string;
  saving: number;
  @ViewChild('_age') _age;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private keyboard: Keyboard
  ) { }

  accountOneKey(event) {
    const key = event.key;
    if (key === 'Enter') {
      this._age.setFocus();
    }
  }

  ageKey(event) {
    const key = event.key;
    if (key === 'Enter') {
      this.keyboard.close();
    }
  }

  toElaborate(accountOne, age) {
    if (accountOne.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Account one not defined',
        subTitle: 'Please insert ammount account one',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (age.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Age not defined',
        subTitle: 'Please insert age',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    this.navCtrl.push(EpfElaborationPage, {
      age: this.age,
      presentValue: this.total()
    });
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
    const value = ( accountOne - this.saving ) * 0.3
    if (value < 0) {
      return 0;
    }
    return value;
  }

}
