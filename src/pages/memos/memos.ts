import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";

import { MemoProvider } from "../../providers/memo/memo";
import { Memo } from "../../components/home/memo";
import { MemoDetailPage } from "../../pages/home/memo-detail/memo-detail";

@Component({
  selector: 'page-memos',
  templateUrl: 'memos.html',
})
export class MemosPage {

  memos: Memo[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private memoProvider: MemoProvider
  ) { }

  ionViewDidLoad() {
    this.memoProvider.getMemos().subscribe(memos => {
      this.memos = memos.map(value => new Memo(value, this.memoProvider));
    });
  }

  profileImageView(img: string) {
    if (img) {
      return { background: `url('${img}') no-repeat center center / cover` };
    }
    return false;
  }

  dateDisplay(date: Date) {
    if (date) {
      return moment(date).fromNow();
    }
  }

  comment(memo) {
    this.navCtrl.push(MemoDetailPage, { memo });
  }

}
