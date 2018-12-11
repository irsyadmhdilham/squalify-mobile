import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PointProvider } from "../../../providers/point/point";
import { point } from "../../../interfaces/point";
import * as moment from "moment";

import { PointDetailPage } from "./point-detail/point-detail";
import { PointGroupMemberPage } from "./point-group-member/point-group-member";

@IonicPage()
@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})
export class PointsPage {

  pageStatus: string;
  segment = 'personal';
  points: point[] = [];
  groupMembers = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private pointProvider: PointProvider
  ) { }

  changeSegment(value) {
    if (value === 'personal') {
      this.fetch();
    } else {
      this.fetchGroup();
    }
  }

  async fetch() {
    const userId = await this.pointProvider.userId();
    this.pageStatus = 'loading';
    this.pointProvider.getPoints(userId).subscribe(observe => {
      this.pageStatus = undefined;
      this.points = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  async fetchGroup() {
    const userId = await this.pointProvider.userId();
    this.pageStatus = 'loading';
    this.pointProvider.getGroupPoints(userId).subscribe(observe => {
      this.pageStatus = undefined;
      this.groupMembers = observe;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  totalPoint(point: point) {
    const total = point.attributes.map(val => val.point).reduce((a, b) => a + b);
    return total;
  }

  date(value: string) {
    return moment(value, 'YYYY-MM-DD');
  }

  ionViewDidLoad() {
    this.fetch();
  }

  navigate(point: point) {
    this.navCtrl.push(PointDetailPage, { point });
  }

  navToMember(data) {
    this.navCtrl.push(PointGroupMemberPage, { data });
  }
}
