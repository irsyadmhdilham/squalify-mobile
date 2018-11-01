import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EpfElaborationPage } from "./epf-elaboration/epf-elaboration";

@IonicPage()
@Component({
  selector: 'page-epf-calculator',
  templateUrl: 'epf-calculator.html',
})
export class EpfCalculatorPage {

  basicSaving: number;
  total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.total = 2323232;
    this.basicSaving = 232323;
  }

  toElaborate() {
    this.navCtrl.push(EpfElaborationPage);
  }

}
