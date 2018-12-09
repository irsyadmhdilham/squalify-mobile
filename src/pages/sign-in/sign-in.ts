import { Component, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Firebase } from "@ionic-native/firebase";

import { AuthProvider } from "../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  @Output() signingIn = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private AuthProvider: AuthProvider,
    private LoadingCtrl: LoadingController,
    private firebase: Firebase
  ) { }

  alert(title, message) {
    const alert = this.alertCtrl.create({ title, subTitle: message, buttons: ['Ok']});
    return alert;
  }

  getFCMToken() {
    this.firebase.getToken().then(token => {
      console.log(token);
    });
  }

  async signIn(email, password) {
    if (!email.valid || email.value === '') {
      const alert = this.alert('Email is required', 'Please insert email');
      alert.present();
      return;
    }
    if (!password.valid || password.value === '') {
      const alert = this.alert('Password is required', 'Please insert password');
      alert.present();
      return;
    }
    const loading = this.LoadingCtrl.create({content: 'Please wait...'});
    loading.present();
    const fcmToken = await this.firebase.getToken();
    this.AuthProvider.authenticate(email.value, password.value, fcmToken).subscribe(observe => {
      if (observe.auth) {
        const userId = observe.data.user_id,
              agencyId = observe.data.agency_id;
        this.AuthProvider.setIds(userId, agencyId).then(() => {
          loading.dismiss();
          this.signingIn.emit(true);
        });
      }
    }, () => {
      loading.dismiss();
      const alert = this.alert('Failed to sign in', 'Please check both and password were correct');
      alert.present();
    });
  }

}
