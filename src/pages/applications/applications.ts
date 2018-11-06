import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EpfCalculatorPage } from "./epf-calculator/epf-calculator";

interface app {
  img: string;
  caption: string;
  component: any;
}

@IonicPage()
@Component({
  selector: 'page-applications',
  templateUrl: 'applications.html',
})
export class ApplicationsPage {

  apps: app[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.apps = [
      { img: '../../assets/imgs/apps/epf.png', caption: 'Unit trust EPF calculator', component: EpfCalculatorPage },
      { img: '../../assets/imgs/apps/cash.png', caption: 'Unit trust cash calculator', component: EpfCalculatorPage }
    ];
  }

  navigate(page) {
    this.navCtrl.push(page.component);
  }

}
