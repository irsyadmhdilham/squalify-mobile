import { Component } from '@angular/core';
import { ViewController, NavParams } from "ionic-angular";

import { ProfileProvider } from "../../providers/profile/profile";

@Component({
  selector: 'post-tips',
  templateUrl: 'post-tips.html'
})
export class PostTipsComponent {

  tips: string;
  mode = this.navParams.get('mode');
  templates: string[];
  pageStatus: string;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private profileProvider: ProfileProvider) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.pageStatus = 'loading';
    this.profileProvider.getWords().subscribe(templates => {
      this.pageStatus = undefined;
      this.templates = templates;
    });
  }

  select(text: string) {
    this.viewCtrl.dismiss({tips: text});
  }

  submit() {
    if (this.tips && this.tips !== '') {
      this.viewCtrl.dismiss({tips: this.tips});
    }
  }

}
