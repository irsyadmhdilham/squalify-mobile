import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ActionSheetController,
  AlertController,
  LoadingController
} from 'ionic-angular';
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
  screenStatus: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private memoProvider: MemoProvider,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    const personal = this.navParams.get('personal');
    this.screenStatus = 'loading';
    if (personal) {
      this.memoProvider.personalMemos().subscribe(memos => {
        this.screenStatus = undefined;
        this.memos = memos.map(value => new Memo(value, this.memoProvider));
      })
    } else {
      this.memoProvider.getMemos().subscribe(memos => {
        this.screenStatus = undefined;
        this.memos = memos.map(value => new Memo(value, this.memoProvider));
      });
    }
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

  memoMore(expiryDate: Date, memoId: number, index: number) {
    const action = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Extend another week',
          handler: () => {
            const extendedDate = moment(expiryDate).add(1, 'weeks').format('D MMM YYYY, h:mma');
            const prompt = this.alertCtrl.create({
              title: 'Are you sure',
              subTitle: `New expiry date: ${extendedDate}`,
              buttons: [
                { text: 'Cancel', role: 'cancel' },
                { text: 'Confirm', handler: () => {
                  const loading = this.loadingCtrl.create({content: 'Please wait...'});
                  loading.present();
                  this.memoProvider.extendMemo(memoId).subscribe(expiryDate => {
                    loading.dismiss();
                    this.memos[index].expiryDate = moment(expiryDate).format('D MMM YYYY, h:mma');
                  }, () => {
                    loading.dismiss();
                  });
                }}
              ]
            });
            prompt.present();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            const prompt = this.alertCtrl.create({
              title: 'Are you sure',
              buttons: [
                { text: 'Cancel', role: 'cancel' },
                { text: 'Confirm', handler: () => {
                  const loading = this.loadingCtrl.create({content: 'Please wait...'});
                  loading.present();
                  this.memoProvider.removeMemo(memoId).subscribe(() => {
                    loading.dismiss();
                    this.memos.splice(index, 1);
                  }, () => {
                    loading.dismiss();
                  });
                }}
              ]
            });
            prompt.present();
          },
          cssClass: 'danger-alert'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    action.present();
  }

}
