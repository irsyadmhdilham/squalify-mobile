import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Network } from "@ionic-native/network";

import { AgencyProvider } from "../../providers/agency/agency";
import { PointProvider } from "../../providers/point/point";

import { PostDetailPage } from "./post-detail/post-detail";
import { AddSalesComponent } from "../../components/sales/add-sales/add-sales";

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
  posts = [];
  points = {
    personal: 0,
    group: 0,
    agency: 0
  };

  constructor(
    public navCtrl: NavController,
    private network: Network,
    private agencyProvider: AgencyProvider,
    private pointProvider: PointProvider,
    private modalCtrl: ModalController
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
    this.fetchPoint();
  }

  ionViewWillLeave() {
    this.onConnect.unsubscribe();
    this.onDisconnect.unsubscribe();
  }

  async fetchAgencyDetail() {
    const agencyId = await this.agencyProvider.agencyId();
    this.agencyProvider.getAgencyDetail(agencyId, 'agency_image,name,posts').subscribe(observe => {
      this.agencyImage = observe.agency_image;
      this.agencyName = observe.name;
      this.posts = observe.posts;
    });
  }

  async fetchPoint() {
    const userId = await this.pointProvider.userId();
    this.pointProvider.getAllPoints(userId).subscribe(observe => {
      this.points.agency = observe.agency;
      this.points.personal = observe.personal;
      this.points.group = observe.group;
    });
  }

  createPost(attribute) {
    switch (attribute) {
      case 'sales':
        const modal = this.modalCtrl.create(AddSalesComponent);
        modal.present();
      break;
    }
  }

  ionViewDidLoad() {
    this.fetchAgencyDetail();
  }

}
