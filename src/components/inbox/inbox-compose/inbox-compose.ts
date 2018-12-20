import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

import { AgencyProvider } from "../../../providers/agency/agency";
import { member } from "../../../interfaces/agency";

@Component({
  selector: 'inbox-compose',
  templateUrl: 'inbox-compose.html'
})
export class InboxComposeComponent {

  screenStatus: string;
  search = '';
  members = [];

  constructor(private viewCtrl: ViewController, private agencyProvider: AgencyProvider) {
  }

  filterMembers(members: member[]) {
    const regex = new RegExp(this.search, 'i');
    return members.filter(val => val.name.match(regex));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    };
  }

  getMembers() {
    this.screenStatus = 'loading';
    this.agencyProvider.getAgencyMembers().subscribe(async members => {
      this.screenStatus = undefined;
      const userId = await this.agencyProvider.userId().toPromise();
      this.members = members.filter(val => val.pk !== userId);
    }, () => {
      this.screenStatus = 'error';
    })
  }

  ionViewDidLoad() {
    this.getMembers();
  }

  selectMember(member) {
    this.viewCtrl.dismiss(member);
  }

}
