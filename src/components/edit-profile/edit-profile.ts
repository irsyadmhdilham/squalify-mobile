import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

@Component({
  selector: 'edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfileComponent {

  constructor(private viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
