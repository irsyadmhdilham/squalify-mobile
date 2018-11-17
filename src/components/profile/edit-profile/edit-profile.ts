import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from "ionic-angular";

@Component({
  selector: 'edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfileComponent {

  name: string;
  profileImage: string;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private alertCtrl: AlertController) { }

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
      this.viewCtrl.dismiss({
        name: this.name,
        profileImage: this.profileImage
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
