import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

import { member } from "../../../models/agency";
import { AgencyProvider } from "../../../providers/agency/agency";

export class Member {

  pk: number;
  name: string;
  designation: string;
  profile_image: string;
  picked = false;

  constructor(member: member) {
    this.name = member.name;
    this.designation = member.designation;
    this.profile_image = member.profile_image;
    this.pk = member.pk;
  }

  pick() {
    if (this.picked) {
      this.picked = false;
      return;
    }
    this.picked = true;
  }
}

@Component({
  selector: 'assign-schedules',
  templateUrl: 'assign-schedules.html'
})
export class AssignSchedulesComponent {

  members: Member[];

  constructor(
    private viewCtrl: ViewController,
    private agencyProvider: AgencyProvider
  ) { }

  profileImage(img: string) {
    if (img) {
      return { background: `url('${img}') center center no-repeat / cover` };
    }
    return false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetch() {
    this.agencyProvider.getAgencyMembers().subscribe(members => {
      this.members = members.map(member => new Member(member));
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

  submit() {
    const members = this.members.filter(value => value.picked);
    this.viewCtrl.dismiss(members);
  }

}
