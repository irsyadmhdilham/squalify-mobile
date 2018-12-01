import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  signInForm = {
    email: '',
    password: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) { }

  alert(title, message) {
    const alert = this.alertCtrl.create({ title, subTitle: message, buttons: ['Ok']});
    return alert;
  }

  signIn() {
    const email = this.signInForm.email,
          password = this.signInForm.password;
    if (email === '') {
      const alert = this.alert('Email is required', 'Please insert email');
      alert.present();
      return;
    }
    if (password === '') {
      const alert = this.alert('Password is required', 'Please insert password');
      alert.present();
      return;
    }
  }

}
