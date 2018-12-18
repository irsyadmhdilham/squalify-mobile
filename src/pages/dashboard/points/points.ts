import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PointProvider } from "../../../providers/point/point";
import { point } from "../../../interfaces/point";

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

  fetch() {
    this.pageStatus = 'loading';
    this.pointProvider.getPoints().subscribe(observe => {
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

  fetchGroup() {
    this.pageStatus = 'loading';
    this.pointProvider.getGroupPoints().subscribe(observe => {
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

  ionViewDidLoad() {
    this.fetch();
  }

  navigate(point) {
    this.navCtrl.push(PointDetailPage, { pointId: point.pk });
  }

  navToMember(data) {
    this.navCtrl.push(PointGroupMemberPage, { data });
  }
}
