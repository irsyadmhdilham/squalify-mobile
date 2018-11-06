import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-epf-retirement-plan',
  templateUrl: 'epf-retirement-plan.html',
})
export class EpfRetirementPlanPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EpfRetirementPlanPage');
  }

}
