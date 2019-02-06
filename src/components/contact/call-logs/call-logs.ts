import { Component } from '@angular/core';
import { ViewController, Toggle, Col } from "ionic-angular";
import * as moment from "moment";

import { ContactProvider } from "../../../providers/contact/contact";
import { logs } from "../../../models/contact";

import { Colors } from "../../../functions/colors";

@Component({
  selector: 'call-logs',
  templateUrl: 'call-logs.html'
})
export class CallLogsComponent {

  callLogs: logs[];
  pageStatus: string;

  constructor(private viewCtrl: ViewController, private contactProvider: ContactProvider) {
    moment.updateLocale('en', {
      calendar: {
        lastDay: '[Yesterday], h:mma',
        sameDay: '[Today], h:mma',
        sameElse: 'D MMM YYYY, h:mma'
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  date(date: string) {
    return moment(date).calendar();
  }

  update(event: Toggle, id: number) {
    this.contactProvider.updateCallLog(id, event.value).subscribe();
  }

  status(answered: boolean) {
    const color = answered ? Colors.secondary : Colors.danger;
    return { color };
  }

  fetch() {
    this.pageStatus = 'loading';
    this.contactProvider.getCallLogs().subscribe(callLogs => {
      this.pageStatus = undefined;
      this.callLogs = callLogs;
    }, () => {
      this.pageStatus = 'error';
    });
  }

  ionViewDidLoad() {
    this.fetch();
  }

}
