import { Component } from '@angular/core';
import { ViewController, NavParams, Platform, LoadingController, AlertController } from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { Observable, Observer } from "rxjs";
import { first, switchMap, map } from "rxjs/operators";
import { AgencyProvider } from "../../providers/agency/agency";
import { Store } from "@ngrx/store";

import { store } from "../../models/store";
import { AgencyNameImage } from "../../store/actions/profile.action";

interface uploadImage {
  upload: boolean;
  image?: string;
  succeed?: boolean;
}

@Component({
  selector: 'edit-agency',
  templateUrl: 'edit-agency.html'
})
export class EditAgencyComponent {

  agencyName: string;
  agencyImage: string;
  imageToUpload: string;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private camera: Camera,
    private transfer: FileTransfer,
    private agencyProvider: AgencyProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private store: Store<store>
  ) { }

  agencyImageView() {
    if (this.agencyImage) {
      return { background: `url('${this.agencyImage}') center center no-repeat / cover` };
    }
    return false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  uploadImage(): Observable<uploadImage> {
    return (Observable.create((observer: Observer<uploadImage>) => {
      const isCordova = this.platform.is('cordova');
      if (isCordova && this.imageToUpload) {
        const fileTransfer: FileTransferObject = this.transfer.create(),
        options: FileUploadOptions = {
          fileKey: 'agency_image',
          chunkedMode: false,
          mimeType: 'image/jpeg',
          httpMethod: 'PUT',
          headers: {}
        };
        this.platform.ready().then(async () => {
          const agencyURL = await this.agencyProvider.agencyUrl('agency-image/').toPromise();
          fileTransfer.upload(this.imageToUpload, agencyURL, options).then(data => {
            const response = JSON.parse(data.response);
            observer.next({upload: true, succeed: true, image: response.agency_image});
          }).catch(err => observer.error(err));
        });
      } else {
        observer.next({upload: false})
      }
    }) as Observable<uploadImage>).pipe(first());
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
          const imgPath = (window as any).Ionic.WebView.convertFileSrc(imageData);
          this.agencyImage = imgPath;
          this.imageToUpload = imageData;
        }).catch(() => {});
      });
    }
  }

  ionViewDidLoad() {
    const agencyName = this.navParams.get('agencyName'),
          agencyImage = this.navParams.get('agencyImage');
    this.agencyName = agencyName;
    this.agencyImage = agencyImage;
    this.androidPermissionsHandler();
  }

  androidPermissionsHandler() {
    const isCordova = this.platform.is('cordova'),
          isMobile = this.platform.is('mobile'),
          isAndroid = this.platform.is('android');
    if (isCordova && isMobile && isAndroid) {
      this.platform.ready().then(() => {
        const readExternalStorage = this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE;
        this.androidPermissions.checkPermission(readExternalStorage).then(
          result => console.log(result.hasPermission),
          () => this.androidPermissions.requestPermission(readExternalStorage)
        );
      });
    }
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
      this.uploadImage().pipe(
        switchMap((upload: uploadImage) => {
          return this.agencyProvider.updateAgency({name: this.agencyName}).pipe(map(data => {
            return { agencyName: data.name, agencyImage: upload.image };
          }));
        })
      ).subscribe(observe => {
        loading.dismiss();
        const agencyImage = observe.agencyImage ? observe.agencyImage : this.agencyImage;
        this.store.dispatch(new AgencyNameImage({ agencyName: observe.agencyName, agencyImage }));
        this.viewCtrl.dismiss({
          agencyName: observe.agencyName,
          agencyImage
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

}
