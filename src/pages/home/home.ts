import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Network } from "@ionic-native/network";

import { AgencyProvider } from "../../providers/agency/agency";

import { AddSalesComponent } from "../../components/sales/add-sales/add-sales";
import { AddContactComponent } from "../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../components/schedule/add-schedule/add-schedule";
import { NotificationsPage } from '../notifications/notifications';

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
  like;
  points = {
    personal: 0,
    group: 0,
    agency: 0
  };

  constructor(
    public navCtrl: NavController,
    private network: Network,
    private agencyProvider: AgencyProvider,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

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
  }

  ionViewWillEnter() {
    const like = this.navParams.get('like');
    if (like) {
      this.like = like;
    }
    this.fetch();
  }

  ionViewWillLeave() {
    this.onConnect.unsubscribe();
    this.onDisconnect.unsubscribe();
  }

  async fetch() {
    const agencyId = await this.agencyProvider.agencyId(),
          userId = await this.agencyProvider.userId();
    this.agencyProvider.getAgencyDetail(agencyId, 'agency_image,name,posts,points', userId).subscribe(observe => {
      this.agencyImage = observe.agency_image;
      this.agencyName = observe.name;
      this.posts = observe.posts;
      this.points = observe.points;
    });
  }

  createPost(attribute) {
    const createModal = (component) => {
      return this.modalCtrl.create(component)
    };
    switch (attribute) {
      case 'sales':
        const sales = createModal(AddSalesComponent);
        sales.present();
      break;
      case 'contact':
        const contact = createModal(AddContactComponent);
        contact.present();
      break;
      case 'schedule':
        const schedule = createModal(AddScheduleComponent);
        schedule.present();
      break;
    }
  }

  // ionViewDidLoad() {
  //   this.fetch();
  // }

}
