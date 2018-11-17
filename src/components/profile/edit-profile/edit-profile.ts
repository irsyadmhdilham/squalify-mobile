import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController, LoadingController } from "ionic-angular";

import { ProfileProvider } from "../../../providers/profile/profile";

@Component({
  selector: 'edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfileComponent {

  name: string;
  profileImage: string;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private profileProvider: ProfileProvider,
    private loadingCtrl: LoadingController
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  profileImageView() {
    return { background: `url('${this.profileImage}') center center no-repeat / cover` };
  }

  submitChanges(checkName) {
    try {    
      if (!checkName.valid) {
        throw 'Please insert name';
      }
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.profileProvider.updateProfile({name: this.name}).subscribe(observe => {
        loading.dismiss();
        this.viewCtrl.dismiss({
          name: observe.name,
          profileImage: this.profileImage
        });
      }, (err: Error) => {
        loading.dismiss();
      });
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Empty required field',
        subTitle: err
      });
      alert.present();
    }
  }

  ionViewDidLoad() {
    const name = this.navParams.get('name'),
          profileImage = this.navParams.get('profileImage');
    this.name = name;
    this.profileImage = profileImage;
  }

}
