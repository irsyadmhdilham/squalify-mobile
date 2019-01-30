import { Component } from '@angular/core';
import { ViewController, LoadingController, AlertController, Platform } from "ionic-angular";
import { CameraOptions, Camera } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { AgencyProvider } from "../../../providers/agency/agency";
import { map, first, switchMap } from "rxjs/operators";
import { Observable, Observer } from "rxjs";

import { member } from "../../../models/agency";
import { InboxProvider } from "../../../providers/inbox/inbox";

type memberSelect = member & { chosen?: boolean };

interface uploadImage {
  upload: boolean;
  group_image?: string;
  chatId?: boolean;
}

@Component({
  selector: 'create-groupchat',
  templateUrl: 'create-groupchat.html'
})
export class CreateGroupchatComponent {

  pageStatus: string;
  members: memberSelect[];
  title: string;
  image: string;
  imageToUpload: string;

  constructor(
    private agencyProvider: AgencyProvider,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private inboxProvider: InboxProvider,
    private alertCtrl: AlertController,
    private camera: Camera,
    private platform: Platform,
    private transfer: FileTransfer,
    private androidPermissions: AndroidPermissions
  ) { }

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

  addChangeImage() {
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
          this.image = imgPath;
          this.imageToUpload = imageData;
        }).catch(() => {});
      });
    }
  }

  uploadImage(): Observable<uploadImage> {
    return (Observable.create(async (observer: Observer<uploadImage>) => {
      const isCordova = this.platform.is('cordova');
      if (isCordova && this.imageToUpload) {
        const fileTransfer: FileTransferObject = this.transfer.create(),
        options: FileUploadOptions = {
          fileKey: 'group_image',
          chunkedMode: false,
          mimeType: 'image/jpeg',
          httpMethod: 'POST',
          params: {
            title: this.title,
            userId: await this.inboxProvider.userId().toPromise()
          },
          headers: {}
        };
        this.platform.ready().then(async () => {
          const profileURL = await this.inboxProvider.profileUrl('inbox/group-image/').toPromise();
          fileTransfer.upload(this.imageToUpload, profileURL, options).then(data => {
            const response = JSON.parse(data.response);
            observer.next({upload: true, group_image: response.group_image, chatId: response.pk });
          }).catch(err => observer.error(err));
        });
      } else {
        observer.next({upload: false})
      }
    }) as Observable<uploadImage>).pipe(first());
  }

  groupImage() {
    if (this.image) {
      return { background: `url('${this.image}') no-repeat center center / cover` };
    }
    return false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  select(index: number) {
    let chosen = this.members[index].chosen;
    if (chosen) {
      this.members[index].chosen = false;
    } else {
      this.members[index].chosen = true;
    }
  }

  getMembers() {
    this.pageStatus = 'loading';
    this.agencyProvider.getAgencyMembers().pipe(
      map(members => members.map(val => ({...val, chosen: false})))
    ).subscribe(async members => {
      this.pageStatus = undefined;
      const userId = await this.agencyProvider.userId().toPromise();
      this.members = members.filter(val => val.pk !== userId);
    });
  }

  avatar(member: member) {
    if (member) {
      return { background: `url('${member.profile_image}') center center no-repeat / cover` }
    }
    return false;
  }

  ionViewDidLoad() {
    this.getMembers();
    this.androidPermissionsHandler();
  }

  create() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    try {
      if (!this.title || this.title === '') {
        throw 'Please insert title';
      }
      const members = this.members.filter(val => val.chosen);
      if (members.length === 0) {
        throw 'Please select at least one member';
      }
      loading.present();
      this.uploadImage().pipe(
        switchMap((upload: uploadImage) => {
          let data: any = {
            title: this.title,
            members: members.map(val => val.pk)
          };
          if (upload.upload) {
            data.chatId = upload.chatId;
          }
          return this.inboxProvider.createGroup(data)
      })).subscribe(inbox => {
        loading.dismiss();
        this.viewCtrl.dismiss(inbox);
      });
    } catch(err) {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: err,
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
