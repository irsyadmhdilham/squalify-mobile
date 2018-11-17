import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController } from "ionic-angular";

@Component({
  selector: 'change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordComponent {

  @ViewChild('_newPassword') _newPassword;
  @ViewChild('_confirmPassword') _confirmPassword;

  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController) { }

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

  submit(password, newPassword, confirmPassword) {
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
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
