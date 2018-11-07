import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Keyboard, AlertController } from 'ionic-angular';

import { CashElaborationPage } from "./cash-elaboration/cash-elaboration";

import { futureValue } from "../../../functions/future-value";

@IonicPage()
@Component({
  selector: 'page-cash-calculator',
  templateUrl: 'cash-calculator.html',
})
export class CashCalculatorPage {

  principal = '';
  monthlyAddition = '';
  interestRate = '';
  duration = '';
  @ViewChild('_monthlyAddition') _monthlyAddition;
  @ViewChild('_interestRate') _interestRate;
  @ViewChild('_duration') _duration;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private alertCtrl: AlertController
  ) { }

  futureValueOutput() {
    const principal = this.principal === '' ? 0 : parseFloat(this.principal),
          monthlyAddition = this.monthlyAddition === '' ? 0 : parseFloat(this.monthlyAddition),
          interestRate = this.interestRate === '' ? 0 : parseFloat(this.interestRate),
          duration = this.duration === '' ? 0 : parseInt(this.duration);
    const value = futureValue(principal, monthlyAddition, interestRate, duration);
    return parseFloat(value);
  }

  focusInputField(field, event) {
    if (event.key === 'Enter') {
      switch (field) {
        case 'principal':
          this._monthlyAddition.setFocus();
        break;
        case 'monthly addition':
          this._interestRate.setFocus();
        break;
        case 'interest rate':
          this._duration.setFocus();
        break;
      }
    }
  }

  keyboardDown(event) {
    if (event.key === 'Enter') {
      this.keyboard.close();
    }
  }

  toElaborate(principal, interestRate, duration) {
    if (principal.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Principal not defined',
        subTitle: 'Please insert principal amount',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (interestRate.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Interest rate not defined',
        subTitle: 'Please insert interest rate amount',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (duration.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Duration not defined',
        subTitle: 'Please insert duration',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    this.navCtrl.push(CashElaborationPage, {
      principal: this.principal === '' ? 0 : parseFloat(this.principal),
      duration: this.duration === '' ? 0 : parseInt(this.duration)
    });
  }

}
