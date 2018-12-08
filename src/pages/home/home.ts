import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Network } from "@ionic-native/network";

import { AgencyProvider } from "../../providers/agency/agency";
import { PointProvider } from "../../providers/point/point";

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
    private pointProvider: PointProvider,
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
    this.fetchPoint();
  }

  ionViewWillEnter() {
    const like = this.navParams.get('like');
    if (like) {
      this.like = like;
    }
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

  ionViewDidLoad() {
    this.fetchAgencyDetail();
  }

}
