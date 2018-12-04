import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { member } from "../../../interfaces/group";

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  pageStatus: string;
  members: member[];

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

}
