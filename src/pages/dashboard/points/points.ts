import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})
export class PointsPage {

  pageStatus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

}
