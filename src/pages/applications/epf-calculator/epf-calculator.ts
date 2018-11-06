import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) { }

  toElaborate() {
    if (!this.age || this.age === '') {
      const alert = this.alertCtrl.create({
        title: 'Age not defined',
        subTitle: 'Please insert age',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if ( !this.accountOne || this.accountOne === '') {
      const alert = this.alertCtrl.create({
        title: 'Account one not defined',
        subTitle: 'Please insert ammount account one',
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
    return ( accountOne - this.saving ) * 0.3;
  }

}
