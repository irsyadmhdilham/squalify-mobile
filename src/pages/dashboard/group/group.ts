import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { member } from "../../../models/group";
import { GroupProvider } from "../../../providers/group/group";
import { GroupMemberPage } from "./group-member/group-member";

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  pageStatus: string;
  members: member[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private groupProvider: GroupProvider
  ) { }

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
    this.groupProvider.getGroupDetail().subscribe(observe => {
      this.pageStatus = undefined;
      this.members = observe.members;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

  navigateDetail(member: member) {
    this.navCtrl.push(GroupMemberPage, { member });
  }

}
