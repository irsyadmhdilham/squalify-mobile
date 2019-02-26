import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, NavParams } from "ionic-angular";

import { ContactProvider } from "../../../providers/contact/contact";
import { logs } from "../../../models/contact";

@Component({
  selector: 'log-remark',
  templateUrl: 'log-remark.html'
})
export class LogRemarkComponent {

  mode = 'add';
  remark: string;
  index: number = this.navParams.get('index');
  logs: logs = this.navParams.get('logs');

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private contactProvider: ContactProvider,
    private navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    const logs: logs = this.navParams.get('logs');
    this.logs = logs;
    if (logs.remark) {
      this.mode = 'edit';
      this.remark = logs.remark;
    }
  }

  submit() {
    if (this.remark === '' || !this.remark) {
      const alert = this.alertCtrl.create({title: 'Required field', subTitle: 'Please insert remark', buttons: ['Ok']});
      alert.present();
      return;
    }
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.logs.remark = this.remark;
    this.contactProvider.callLogRemark(this.logs.pk, this.remark).subscribe(logs => {
      loading.dismiss();
      this.viewCtrl.dismiss({
        index: this.index,
        logs: logs
      });
    }, () => {
      loading.dismiss();
      const alert = this.alertCtrl.create({title: 'Error', subTitle: 'Error in updating call logs', buttons: ['Ok']});
      alert.present();
    });
  }

}
