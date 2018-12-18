import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PointProvider } from "../../../../providers/point/point";
import { PointGroupMemberPage } from "../point-group-member/point-group-member";

@IonicPage()
@Component({
  selector: 'page-point-downlines',
  templateUrl: 'point-downlines.html',
})
export class PointDownlinesPage {

  pk: number;
  downlines = [];
  pageStatus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pointProvider: PointProvider) {
  }

  fetch() {
    this.pageStatus = 'loading';
    this.pointProvider.getDownline(this.pk).subscribe(observe => {
      this.pageStatus = undefined;
      this.downlines = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  navigate(data) {
    this.navCtrl.push(PointGroupMemberPage, { data });
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  ionViewDidLoad() {
    const user = this.navParams.get('user');
    this.pk = user;
    this.fetch();
  }

}
