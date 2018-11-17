import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { ChangePasswordComponent } from "../../components/change-password/change-password";
import { ChangeEmailComponent } from "../../components/change-email/change-email";
import { EditProfileComponent } from "../../components/edit-profile/edit-profile";
import { SettingsPage } from "./settings/settings";

import { ProfileProvider } from "../../providers/profile/profile";
import { settings } from "../../interfaces/profile-settings";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  name: string;
  designation: string;
  agency: string;
  company: string;
  profileImage: string;
  settings: settings;
  loading: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private profileProvider: ProfileProvider
  ) { }

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
    const modal = this.modalCtrl.create(EditProfileComponent);
    modal.present();
  }

  _signOut() {
    
  }

  signOut() {
    const alert = this.alertCtrl.create({
      title: 'Are you sure',
      subTitle: 'Are you sure to sign out?',
      buttons: [
        { text: 'Cancel' },
        { text: 'Sign out', cssClass: 'danger-alert', handler: this._signOut }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    this.loading = true;
    this.profileProvider.getProfile().subscribe(observe => {
      this.loading = false;
      this.name = observe.name;
      this.designation = observe.designation;
      this.agency = observe.agency.name;
      this.company = observe.agency.company;
      this.profileImage = observe.profile_image;
      this.settings = observe.settings;
    }, (err: Error) => console.log(err));
  }

}
