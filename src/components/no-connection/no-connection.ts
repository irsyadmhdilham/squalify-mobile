import { Component } from '@angular/core';
import { Platform, ViewController } from "ionic-angular";
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'no-connection',
  templateUrl: 'no-connection.html'
})
export class NoConnectionComponent {

  connectionListener: Subscription;

  constructor(
    private platform: Platform,
    private network: Network,
    private viewCtrl: ViewController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  retry() {
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        const type = this.network.type.match(/(unknown|none)/);
        if (!type) {
          this.dismiss();
        }
      });
    }
  }

  listenToConnection() {
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        this.connectionListener = this.network.onConnect().subscribe(() => {
          this.dismiss();
        });
      });
    }
  }

  ionViewDidLoad() {
    this.listenToConnection();
  }

  ionViewWillUnload() {
    if (this.connectionListener) {
      this.connectionListener.unsubscribe();
    }
  }

}
