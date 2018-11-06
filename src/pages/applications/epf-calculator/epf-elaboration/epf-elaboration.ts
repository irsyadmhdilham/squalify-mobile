import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-epf-elaboration',
  templateUrl: 'epf-elaboration.html',
})
export class EpfElaborationPage {

  rate = 6;
  rates: number[] = [6, 8, 10, 12];
  presentAge = 0;
  presentValue = 0;
  presentToRetirement = 28;
  futureValue = 23233;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

}
