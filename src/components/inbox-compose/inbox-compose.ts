import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";

@Component({
  selector: 'inbox-compose',
  templateUrl: 'inbox-compose.html'
})
export class InboxComposeComponent {

  constructor(private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
