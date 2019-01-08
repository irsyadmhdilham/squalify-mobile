import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

@Component({
  selector: 'edit-agency',
  templateUrl: 'edit-agency.html'
})
export class EditAgencyComponent {

  agencyName: string;
  agencyImage: string;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) { }

  agencyImageView() {
    if (this.agencyImage) {
      return { background: `url('${this.agencyImage}') center center no-repeat / cover` };
    }
    return false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    const agencyName = this.navParams.get('agencyName'),
          agencyImage = this.navParams.get('agencyImage');
    this.agencyName = agencyName;
    this.agencyImage = agencyImage;
  }

}
