import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, NavParams } from "ionic-angular";
import * as moment from "moment";
import { Observable } from 'rxjs';

import { MemoProvider, memoData } from "../../providers/memo/memo";
import { memo } from "../../models/memo";

@Component({
  selector: 'compose-memo',
  templateUrl: 'compose-memo.html'
})
export class ComposeMemoComponent {

  text = '';
  countdown: string;
  edit = false;
  postId: number;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private memoProvider: MemoProvider
  ) { }

  ionViewDidLoad() {
    const edit = this.navParams.get('edit'),
          memo: memo = this.navParams.get('memo'),
          postId: number = this.navParams.get('postId');
    if (edit) {
      this.edit = true;
      const dateFormat = 'YYYY-MM-DDTHH:mm'
      const countdown = memo.countdown ? moment(memo.countdown).format(dateFormat) : undefined;
      this.countdown = countdown;
      this.text = memo.text;
      this.postId = postId;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  postUpdate() {
    if (!this.text || this.text === '') {
      this.alertCtrl.create({title: 'No memo written', subTitle: 'Please write something', buttons: ['Ok']})
      .present();
      return;
    }
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const data: memoData = {
      text: this.text,
      countdown: this.countdown ? moment(this.countdown, dateFormat).toDate() : null
    }
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    const httpRequest = (): Observable<any> => {
      if (this.edit) {
        return this.memoProvider.updateMemo(data, this.postId);
      }
      return this.memoProvider.postMemo(data);
    };
    httpRequest().subscribe(post => {
      loading.dismiss();
      this.viewCtrl.dismiss(post);
    }, () => {
      loading.dismiss();
      this.alertCtrl.create({title: 'Error', subTitle: 'Failed to post memo', buttons: ['Ok']})
      .present();
    });
  }

}
