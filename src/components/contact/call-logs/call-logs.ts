import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";
import * as moment from "moment";

import { logs } from "../../../models/contact";

const callLogs: logs[] = require('./call-logs.json');

@Component({
  selector: 'call-logs',
  templateUrl: 'call-logs.html'
})
export class CallLogsComponent {

  callLogs: logs[] = callLogs;

  constructor(private viewCtrl: ViewController) {
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

}
