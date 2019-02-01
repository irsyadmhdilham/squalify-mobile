import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PointProvider } from "../../../../providers/point/point";
import { PointDetailPage } from "../point-detail/point-detail";
import { PointDownlinesPage } from "../point-downlines/point-downlines";

import * as moment from "moment";
import { groupPoint } from "../../../../models/point";

@Component({
  selector: 'page-point-downline-group-member',
  templateUrl: 'point-downline-group-member.html',
})
export class PointDownlineGroupMemberPage {

  members: groupPoint[] = [];
  date: Date;
  pageStatus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pointProvider: PointProvider) {
  }

  avatarImage(image: string) {
    if (!image) {
      return false;
    }
    return {
      background: `url('${image}') center center no-repeat / cover`
    };
  }

  downlineMargin(pk: number) {
    return {
      marginLeft: pk ? '1em' : false
    };
  }

  fetch(date: string, userId: number) {
    this.pageStatus = 'loading';
    this.pointProvider.getDownlineGroupMember(date, userId).subscribe(members => {
      this.pageStatus = undefined;
      this.members = members;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    const date: string = this.navParams.get('date'),
          userId: number = this.navParams.get('userId');
    this.date = moment(date).toDate();
    this.fetch(date, userId);
  }

  viewPointDetail(pointId: number) {
    this.navCtrl.push(PointDetailPage, { pointId });
  }

  viewDownlines(member: groupPoint) {
    const userId = member.pk,
          name = member.name;
    this.navCtrl.push(PointDownlinesPage, { userId, name });
  }

}
