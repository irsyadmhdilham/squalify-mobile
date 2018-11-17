import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController, Keyboard } from "ionic-angular";

@Component({
  selector: 'change-email',
  templateUrl: 'change-email.html'
})
export class ChangeEmailComponent {

  @ViewChild('_newEmail') _newEmail;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private keyboard: Keyboard
  ) { }

  focusInputField(event) {
    if (event.key === 'Enter') {
      this._newEmail.setFocus();
    }
  }

  returnKeyNewEmail(email, newEmail, event) {
    if (event.key === 'Enter') {
      this.submit(email, newEmail);
    }
  }

  submit(email, newEmail) {
    if (email.invalid) {
      const alert = this.alertCtrl.create({
        title: 'Email not defined',
        subTitle: 'Please insert email',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (newEmail.invalid) {
      const alert = this.alertCtrl.create({
        title: 'New email not defined',
        subTitle: 'Please insert new email',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    if (email.value === newEmail.value) {
      const alert = this.alertCtrl.create({
        title: 'New email match email',
        subTitle: 'Please use another email',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    this.keyboard.close();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
