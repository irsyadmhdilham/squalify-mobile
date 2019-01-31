import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

import { member } from "../../../models/agency";
import { InboxProvider } from "../../../providers/inbox/inbox";

@Component({
  selector: 'inbox-group-details',
  templateUrl: 'inbox-group-details.html'
})
export class InboxGroupDetailsComponent {

  members: member[];
  admin: number | boolean;
  title: string = this.navParams.get('title');

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private inboxProvider: InboxProvider) { }

  image() {
    const image = this.navParams.get('image');
    if (image) {
      return { background: `url('${image}') center center no-repeat / cover` };
    }
    return false;
  }

  profileImage(img: string) {
    if (img) {
      return { background: `url('${img}') center center no-repeat / cover` };
    }
    return false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    const members: member[] = this.navParams.get('members'),
          members2: member[] = [...members];
    this.inboxProvider.userId().subscribe(userId => {
      const x = members.findIndex(val => val.pk === userId);
      members.splice(x, 1);
      const admin = members2[x];
      members.unshift(admin);
      this.admin = userId;
      this.members = members;
    });
  }

}
