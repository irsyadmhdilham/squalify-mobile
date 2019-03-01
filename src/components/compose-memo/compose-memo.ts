import { Component } from '@angular/core';
import { ViewController, AlertController } from "ionic-angular";
import * as moment from "moment";

import { Colors } from "../../functions/colors";

import { PostProvider } from "../../providers/post/post";

@Component({
  selector: 'compose-memo',
  templateUrl: 'compose-memo.html'
})
export class ComposeMemoComponent {

  text = '';
  dateStart: string;
  dateEnd: string;
  countdown: string;

  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController, private postProvider: PostProvider) { }

  characters() {
    const text = 200 - this.text.length;
    if (text <= 0) {
      return { color: Colors.danger };
    }
    return { color: Colors.primary };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  post() {
    if (!this.dateEnd || this.dateEnd === '') {
      this.alertCtrl.create({title: 'Error', subTitle: 'Please pick end date & time', buttons: ['Ok']})
      .present();
      return;
    }
    if (!this.text || this.text === '') {
      this.alertCtrl.create({title: 'No memo written', subTitle: 'Please write something', buttons: ['Ok']})
      .present();
      return;
    }
    const data = {
      text: this.text,
      dateStart: this.dateStart ? moment(this.dateStart).toDate() : null,
      dateEnd: moment(this.dateEnd).toDate(),
      countdown: this.countdown ? moment(this.countdown).toDate() : null
    }
    this.postProvider.postMemo(data).subscribe(memo => {

    });
  }

}
