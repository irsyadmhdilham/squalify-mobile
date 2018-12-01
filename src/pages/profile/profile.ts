import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController
} from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { ChangePasswordComponent } from "../../components/profile/change-password/change-password";
import { ChangeEmailComponent } from "../../components/profile/change-email/change-email";
import { EditProfileComponent } from "../../components/profile/edit-profile/edit-profile";
import { SettingsPage } from "./settings/settings";

import { Ids } from "../../functions/config";
import { ProfileProvider } from "../../providers/profile/profile";
import { settings } from "../../interfaces/profile-settings";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage extends Ids {

  name: string;
  designation: string;
  agency: string;
  company: string;
  profileImage: string;
  settings: settings;
  pageStatus: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private profileProvider: ProfileProvider,
    public storage: Storage,
    private loadingCtrl: LoadingController
  ) {
    super(storage);
  }

  profileImageDisplay() {
    return {
      background: `url('${this.profileImage}') center center no-repeat / cover`
    };
  }

  toSettings() {
    this.navCtrl.push(SettingsPage, { settings: this.settings });
  }

  changePassword() {
    const modal = this.modalCtrl.create(ChangePasswordComponent);
    modal.present();
  }

  changeEmail() {
    const modal = this.modalCtrl.create(ChangeEmailComponent);
    modal.present();
  }

  editProfile() {
    const modal = this.modalCtrl.create(EditProfileComponent, {
      name: this.name,
      profileImage: this.profileImage
    });
    modal.present();
    modal.onDidDismiss(data => {
      this.name = data.name;
      this.profileImage = data.profileImage;
    })
  }

  _signOut() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.removeAllId().then(value => {
      if (value) {
        loading.dismiss();
        console.log('signed out');
      }
    });
  }

  signOut() {
    const alert = this.alertCtrl.create({
      title: 'Are you sure',
      subTitle: 'Are you sure to sign out?',
      buttons: [
        { text: 'Cancel' },
        { text: 'Sign out', cssClass: 'danger-alert', handler: this._signOut.bind(this) }
      ]
    });
    alert.present();
  }

  fetch() {
    this.pageStatus = 'loading';
    this.profileProvider.userId().then(userId => {
      this.profileProvider.getProfile(userId).subscribe(observe => {
        this.pageStatus = undefined;
        this.name = observe.name;
        this.designation = observe.designation;
        this.agency = observe.agency.name;
        this.company = observe.agency.company;
        this.profileImage = observe.profile_image;
        this.settings = observe.settings;
      }, () => {
        this.pageStatus = 'error';
      });
    })
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
