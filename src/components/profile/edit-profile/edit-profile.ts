import { Component } from '@angular/core';
import {
  ViewController,
  NavParams,
  AlertController,
  LoadingController,
  Platform,
  normalizeURL
} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";

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
    private loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private camera: Camera,
    private platform: Platform
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    const isCordova = this.platform.is('cordova');
    if (isCordova) {
      this.platform.ready().then(() => {
        this.camera.getPicture(options).then(async imageData => {
          const fileTransfer: FileTransferObject = this.transfer.create(),
                options: FileUploadOptions = {
                  fileKey: 'profile_image',
                  chunkedMode: false,
                  mimeType: 'image/jpeg',
                  httpMethod: 'PUT',
                  headers: {}
                };
          const imgPath = normalizeURL(imageData);
          this.profileImage = imgPath;
          const profileURL = await this.profileProvider.profileUrl('profile-image/').toPromise();
          fileTransfer.upload(imageData, profileURL, options).then(data => {
            console.log(JSON.stringify(data, null, 4));
          }).catch(err => console.warn(JSON.stringify(err, null, 4)));
        });
      });
    }
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
      this.profileProvider.updateProfile({name: this.name, profile_image: this.profileImage}).subscribe(observe => {
        loading.dismiss();
        this.viewCtrl.dismiss({
          name: observe.name,
          profileImage: this.profileImage
        });
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
    } catch (err) {
      const alert = this.alertCtrl.create({
        title: 'Empty required field',
        subTitle: err,
        buttons: ['Ok']
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
