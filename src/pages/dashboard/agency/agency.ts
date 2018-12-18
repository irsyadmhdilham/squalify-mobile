import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { member } from "../../../interfaces/agency";
import { AgencyProvider } from "../../../providers/agency/agency";

@IonicPage()
@Component({
  selector: 'page-agency',
  templateUrl: 'agency.html',
})
export class AgencyPage {

  pageStatus: string;
  members: member[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private agencyProvider: AgencyProvider) {
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    }
  }

  fetch() {
    this.pageStatus = 'loading';
    this.agencyProvider.getAgencyDetail('members').subscribe(observe => {
      this.pageStatus = undefined;
      this.members = observe.members;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
