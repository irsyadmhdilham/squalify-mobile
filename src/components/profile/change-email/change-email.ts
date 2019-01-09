import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgModel } from "@angular/forms";
import {
  ViewController,
  AlertController,
  Keyboard,
  TextInput,
  LoadingController
} from "ionic-angular";

import { ProfileProvider } from "../../../providers/profile/profile";

@Component({
  selector: 'change-email',
  templateUrl: 'change-email.html'
})
export class ChangeEmailComponent {

  @ViewChild('_newEmail') _newEmail: TextInput;
  @ViewChild('_email') _email: TextInput;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private keyboard: Keyboard,
    private profileProvider: ProfileProvider,
    private loadingCtrl: LoadingController
  ) { }

  focusInputField(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this._newEmail.setFocus();
    }
  }

  returnKeyNewEmail(email: NgModel, newEmail: NgModel, event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submit('input', email, newEmail);
    }
  }

  submit(action: string, email: NgModel, newEmail: NgModel) {
    if (email.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Email not defined or invalid format',
        subTitle: 'Please insert email in correct format',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (newEmail.invalid) {
      const alert = this.alertCtrl.create({
        title: 'New email not defined or invalid format',
        subTitle: 'Please insert new email in correct format',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (email.value === newEmail.value) {
      const alert = this.alertCtrl.create({
        title: 'New email match email',
        subTitle: 'Please use another email',
        buttons: [{
          text: 'Ok',
          handler: () => {
            this._newEmail.value = '';
            setTimeout(() => {
              this._newEmail.setFocus();
            }, 300);
          }
        }]
      });
      alert.present();
      return;
    }
    if (action !== 'input') {
      this.keyboard.close();
    }
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.profileProvider.changeEmail(email.value, newEmail.value).subscribe(() => {
      loading.dismiss();
      this.dismiss();
    }, (error: HttpErrorResponse) => {
      loading.dismiss();
      let title = 'Error occured',
          subTitle = 'Failed to change email',
          buttons: any = ['Ok'];
      if (error.status === 406) {
        title = 'Invalid current email';
        subTitle = 'Please insert correct email';
        buttons = [{ text: 'Ok', handler: () => {
          this._email.value = '';
          setTimeout(() => {
            this._email.setFocus();
          }, 300);
        }}];
      }
      const alert = this.alertCtrl.create({ title, subTitle, buttons });
      alert.present();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
