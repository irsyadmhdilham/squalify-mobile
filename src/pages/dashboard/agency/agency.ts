import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { member } from "../../../models/agency";
import { AgencyProvider } from "../../../providers/agency/agency";

import { EditAgencyComponent } from "../../../components/edit-agency/edit-agency";

@IonicPage()
@Component({
  selector: 'page-agency',
  templateUrl: 'agency.html',
})
export class AgencyPage {

  pageStatus: string;
  agencyImage: string;
  agencyName: string;
  members: member[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private agencyProvider: AgencyProvider,
    private modalCtrl: ModalController
  ) { }

  agencyImageView() {
    if (this.agencyImage) {
      return { background: `url('${this.agencyImage}') center center no-repeat / cover` };
    }
    return false;
  }

  profileImage(img) {
    if (!img) {
      return false;
    }
    return {
      background: `url('${img}') center center no-repeat / cover`
    }
  }

  editAgency() {
    const modal = this.modalCtrl.create(EditAgencyComponent, { agencyImage: this.agencyImage, agencyName: this.agencyName });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.agencyImage = data.agencyImage;
        this.agencyName = data.agencyName;
      }
    });
  }

  fetch() {
    this.pageStatus = 'loading';
    this.agencyProvider.getAgencyDetail('members,agency_image,name').subscribe(observe => {
      this.pageStatus = undefined;
      this.members = observe.members;
      this.agencyImage = observe.agency_image;
      this.agencyName = observe.name;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
