import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PointProvider } from "../../../../providers/point/point";
import { PointDownlinesPage } from "../point-downlines/point-downlines";
import { PointDetailPage } from "../point-detail/point-detail";

@Component({
  selector: 'page-point-group-member',
  templateUrl: 'point-group-member.html',
})
export class PointGroupMemberPage {
  
  pk: number;
  name: string;
  designation: string;
  downline: number;
  profileImage: string;
  points = [];
  pageStatus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pointProvider: PointProvider) {
  }

  viewProfileImage() {
    if (!this.profileImage) {
      return false;
    }
    return {
      background: `url('${this.profileImage}') center center no-repeat / cover`
    };
  }

  fetch() {
    this.pageStatus = 'loading';
    this.pointProvider.getGroupMemberPoints(this.pk).subscribe(observe => {
      this.pageStatus = undefined;
      const points = observe.map(val => {
        return {
          ...val,
          date: new Date(val.date)
        };
      });
      this.points = points;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    const data = this.navParams.get('data');
    this.name = data.name;
    this.designation = data.designation;
    this.profileImage = data.profile_image;
    this.downline = data.downline;
    this.pk = data.pk;
    this.fetch();
  }

  viewDownlines() {
    this.navCtrl.push(PointDownlinesPage, { user: this.pk });
  }

  viewPointDetail(point) {
    this.navCtrl.push(PointDetailPage, { pointId: point.pk });
  }

}
