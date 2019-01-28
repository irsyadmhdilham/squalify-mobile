import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

@Component({
  selector: 'amazing-tips',
  templateUrl: 'amazing-tips.html'
})
export class AmazingTipsComponent {

  text: string;
  mode = 'add';
  index: number;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addUpdate() {
    if (this.mode === 'add') {
      this.viewCtrl.dismiss({text: this.text});
    } else {
      this.viewCtrl.dismiss({text: this.text, index: this.index});
    }
  }

  ionViewDidLoad() {
    const isEdit = this.navParams.get('isEdit');
    if (isEdit) {
      this.text = this.navParams.get('text');
      this.index = this.navParams.get('index');
      this.mode = 'edit';
    }
  }

}
