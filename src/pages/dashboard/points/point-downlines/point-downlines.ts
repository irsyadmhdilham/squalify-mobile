import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PointProvider } from "../../../../providers/point/point";
import { PointDownlineGroupMemberPage } from "../point-downline-group-member/point-downline-group-member";

import { point } from "../../../../models/point";

@Component({
  selector: 'page-point-downlines',
  templateUrl: 'point-downlines.html',
})
export class PointDownlinesPage {

  userId: number;
  points: point[] = [];
  pageStatus: string;
  name: string = this.navParams.get('name');

  constructor(public navCtrl: NavController, public navParams: NavParams, private pointProvider: PointProvider) {
  }

  fetch() {
    this.pageStatus = 'loading';
    this.pointProvider.getDownline(this.userId).subscribe(points => {
      this.pageStatus = undefined;
      this.points = points;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  navToMember(date: string) {
    this.navCtrl.push(PointDownlineGroupMemberPage, { date, userId: this.userId });
  }

  profileImage(img: string) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  ionViewDidLoad() {
    const userId = this.navParams.get('userId');
    this.userId = userId;
    this.fetch();
  }

}
