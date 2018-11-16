import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";

import { Network } from "@ionic-native/network";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  onConnect: Subscription;
  onDisconnect: Subscription;
  connected: boolean = true;

  constructor(
    public navCtrl: NavController,
    private network: Network
  ) { }

  ionViewDidEnter() {
    this.onDisconnect = this.network.onDisconnect().subscribe(() => {
      this.connected = false;
    });

    this.onConnect = this.network.onConnect().subscribe(() => {
      this.connected = true;
    });
  }

  ionViewWillLeave() {
    this.onConnect.unsubscribe();
    this.onDisconnect.unsubscribe();
  }

  retry() {
    console.log('retry');
  }

}
