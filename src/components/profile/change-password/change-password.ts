import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { NgModel } from "@angular/forms";
import {
  ViewController,
  AlertController,
  TextInput,
  LoadingController
} from "ionic-angular";

import { ProfileProvider } from "../../../providers/profile/profile";

@Component({
  selector: 'change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordComponent {

  @ViewChild('_password') _password: TextInput;
  @ViewChild('_newPassword') _newPassword: TextInput;
  @ViewChild('_confirmPassword') _confirmPassword: TextInput;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private profileProvider: ProfileProvider,
    private loadingCtrl: LoadingController
  ) { }

  focusInputField(field, event) {
    if (event.key === 'Enter') {
      switch (field) {
        case 'password':
          this._newPassword.setFocus();
        break;
        case 'new password':
        this._confirmPassword.setFocus();
        break;
      }
    }
  }

  returnKeyConfirmPassword(password, newPassword, confirmPassword, event) {
    if (event.key === 'Enter') {
      this.submit(password, newPassword, confirmPassword);
    }
  }

  submit(password: NgModel, newPassword: NgModel, confirmPassword: NgModel) {
    if (password.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Password not defined',
        subTitle: 'Please insert password',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (newPassword.invalid) {
      const alert = this.alertCtrl.create({
        title: 'New password not defined',
        subTitle: 'Please insert new password',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (confirmPassword.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Confirm password not defined',
        subTitle: 'Please insert confirm password',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (password.value === newPassword.value) {
      const alert = this.alertCtrl.create({
        title: 'New password same as password',
        subTitle: 'Please use another password',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (newPassword.value !== confirmPassword.value) {
      const alert = this.alertCtrl.create({
        title: 'Confirm password not match',
        subTitle: 'Please re-type confirm password',
        buttons: [{text: 'Ok', handler: () => {
          this._confirmPassword.value = '';
          setTimeout(() => {
            this._confirmPassword.setFocus();
          }, 300);
        }}]
      });
      alert.present();
      return;
    }
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.profileProvider.changePassword(password.value, newPassword.value).subscribe(() => {
      loading.dismiss();
      this.dismiss();
    }, (error: HttpErrorResponse) => {
      loading.dismiss();
      const status = error.error.status,
            errorData: string[] = error.error.error_data;
      let title = 'Error',
          subTitle = 'Failed to change password',
          buttons: any = ['Ok'];
      if (status === 'Incorrect password') {
        subTitle = 'Incorrect current password';
        buttons = [{text: 'Ok', handler: () => {
          this._password.value = '';
          setTimeout(() => {
            this._password.setFocus();
          }, 300);
        }}];
      } else if (status === 'Validation failed') {
        subTitle = errorData.join(', ');
        buttons = [{text: 'Ok', handler: () => {
          this._newPassword.value = '';
          this._confirmPassword.value = '';
          setTimeout(() => {
            this._newPassword.setFocus();
          }, 300);
        }}];
      }
      const alert = this.alertCtrl.create({title, subTitle, buttons});
      alert.present();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
