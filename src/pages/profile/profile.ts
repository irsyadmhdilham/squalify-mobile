import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { ChangePasswordComponent } from "../../components/change-password/change-password";
import { ChangeEmailComponent } from "../../components/change-email/change-email";
import { EditProfileComponent } from "../../components/edit-profile/edit-profile";
import { SettingsPage } from "./settings/settings";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  name = 'Irsyad Mhd Ilham';
  designation = 'Group Agency Manager';
  agency = 'Vision Victory Empire';
  company = 'CWA';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  toSettings() {
    this.navCtrl.push(SettingsPage);
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

}
