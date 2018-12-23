import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { member } from "../../../../models/group";
import { GroupProvider } from "../../../../providers/group/group";

@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-member.html',
})
export class GroupMemberPage {

  pk: number;
  name: string;
  designation: string;
  downline: number;
  profileImage: string;
  groupMembers: member[] = [];
  pageStatus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private groupProvider: GroupProvider) { }

  getProfile() {
    const member: member = this.navParams.get('member');
    this.pk = member.pk;
    this.name = member.name;
    this.designation = member.designation;
    this.downline = member.downline;
    this.profileImage = member.profile_image;
  }

  viewProfileImage() {
    if (!this.profileImage) {
      return false;
    }
    return {
      background: `url('${this.profileImage}') center center no-repeat / cover`
    };
  }

  getDownline() {
    if (this.downline || this.downline === 0) {
      this.pageStatus = 'loading';
      this.groupProvider.getGroupDetail(this.pk).subscribe(observe => {
        this.pageStatus = undefined;
        this.groupMembers = observe.members;
      }, () => {
        this.pageStatus = 'error';
      });
    }
  }

  memberImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  ionViewDidLoad() {
    this.getProfile();
    this.getDownline();
  }

}
