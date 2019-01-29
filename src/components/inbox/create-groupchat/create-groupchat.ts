import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";
import { AgencyProvider } from "../../../providers/agency/agency";

import { member } from "../../../models/agency";

@Component({
  selector: 'create-groupchat',
  templateUrl: 'create-groupchat.html'
})
export class CreateGroupchatComponent {

  pageStatus: string;
  members: member[];

  constructor(private agencyProvider: AgencyProvider, private viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getMembers() {
    this.pageStatus = 'loading';
    this.agencyProvider.getAgencyMembers().subscribe(members => {
      this.pageStatus = undefined;
      this.members = members;
    });
  }

  ionViewDidLoad() {
    this.getMembers();
  }

}
