import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Network } from "@ionic-native/network";

import { AgencyProvider } from "../../providers/agency/agency";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  onConnect: Subscription;
  onDisconnect: Subscription;
  connected: boolean = true;
  agencyImage: string;
  agencyName: string;

  constructor(
    public navCtrl: NavController,
    private network: Network,
    private agencyProvider: AgencyProvider
  ) { }

  agencyImageView() {
    if (this.agencyImage) {
      return {
        background: `url('${this.agencyImage}') center center no-repeat / cover`
      };
    }
    return false;
  }

  ionViewDidEnter() {
    this.onDisconnect = this.network.onDisconnect().subscribe(() => {
      this.connected = false;
    });

    this.onConnect = this.network.onConnect().subscribe(() => {
      this.connected = true;
    });

    this.fetchAgencyDetail();
  }

  ionViewWillLeave() {
    this.onConnect.unsubscribe();
    this.onDisconnect.unsubscribe();
  }

  async fetchAgencyDetail() {
    const agencyId = await this.agencyProvider.agencyId()
    this.agencyProvider.getAgencyDetail(agencyId, 'agency_image,name,posts').subscribe(observe => {
      this.agencyImage = observe.agency_image;
      this.agencyName = observe.name;
      console.log(observe);
    });
  }

}
