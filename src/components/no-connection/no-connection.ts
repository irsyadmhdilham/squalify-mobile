import { Component } from '@angular/core';
// import { NavController } from "ionic-angular";

@Component({
  selector: 'no-connection',
  templateUrl: 'no-connection.html'
})
export class NoConnectionComponent {

  constructor(
    // private navCtrl: NavController
  ) { }

  retry() {
    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}
