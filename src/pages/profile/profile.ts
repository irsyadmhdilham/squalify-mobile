import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController,
  Events
} from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Store, select } from "@ngrx/store";
import { take } from "rxjs/operators";

import { ChangePasswordComponent } from "../../components/profile/change-password/change-password";
import { ChangeEmailComponent } from "../../components/profile/change-email/change-email";
import { EditProfileComponent } from "../../components/profile/edit-profile/edit-profile";
import { SettingsPage } from "./settings/settings";
import { NotificationsPage } from "../notifications/notifications";

import { Ids } from "../../functions/config";
import { ProfileProvider } from "../../providers/profile/profile";
import { AuthProvider } from "../../providers/auth/auth";
import { settings } from "../../models/profile-settings";
import { store } from "../../models/store";
import { SocketioReset } from "../../store/actions/socketio.action";

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
  listenEmailNotif: (value) => void;
  listenPushNotif: (value) => void;
  navToSettings = false;
  notifications$ = this.store.pipe(select('notifications'));

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private profileProvider: ProfileProvider,
    private authProvider: AuthProvider,
    public storage: Storage,
    private loadingCtrl: LoadingController,
    private events: Events,
    private store: Store<store>
  ) {
    super(storage);
  }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  profileImageDisplay() {
    return {
      background: `url('${this.profileImage}') center center no-repeat / cover`
    };
  }

  toSettings() {
    this.navToSettings = true;
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
      if (data) {
        this.name = data.name;
        this.profileImage = data.profileImage;
      }
    })
  }

  _signOut() {
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.authProvider.signOut().subscribe(() => {
      this.removeAllCredentials().then(value => {
        if (value) {
          loading.dismiss();
          this.store.pipe(select('io'), take(1)).subscribe((io: any) => {
            io.close();
            this.store.dispatch(new SocketioReset());
          });
          this.events.publish('sign out', 'not sign in');
        }
      });
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
    this.profileProvider.getProfile().subscribe(observe => {
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
  }

  ionViewDidLoad() {
    this.fetch();
  }

  unsubscribeSettingsEvent() {
    if (!this.navToSettings) {
      this.events.unsubscribe('settings:email-notification', this.listenEmailNotif);
      this.events.unsubscribe('settings:push-notification', this.listenPushNotif);
    }
  }

  subscribeSettingsEvent() {
    this.navToSettings = false;
    this.listenEmailNotif = value => {
      this.settings.notifications.email_notification = value;
    };
    this.listenPushNotif = observe => {
      this.settings.notifications.push_notification = observe;
    };
    this.events.subscribe('settings:email-notification', this.listenEmailNotif);
    this.events.subscribe('settings:push-notification', this.listenPushNotif);
  }

  ionViewWillEnter() {
    this.subscribeSettingsEvent();
  }

  ionViewWillLeave() {
    this.unsubscribeSettingsEvent();
  }

}
