import { Component, Input, OnChanges } from '@angular/core';
import * as countdownjs from "countdown";
import * as moment from "moment";

import { memo } from "../../../models/memo";

@Component({
  selector: 'memo',
  templateUrl: 'memo.html'
})
export class MemoComponent implements OnChanges {

  @Input() data: memo;
  count = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  constructor() { }

  profileImageView() {
    if (this.data.posted_by.profile_image) {
      return { background: `url('${this.data.posted_by.profile_image}') no-repeat center center / cover` };
    }
    return false;
  }

  dateDisplay() {
    return moment(this.data.posted_date).fromNow();
  }

  countdown() {
    countdownjs(this.data.countdown, data => {
      this.count.days = data.days;
      this.count.hours = data.hours;
      this.count.minutes = data.minutes;
      this.count.seconds = data.seconds;
    });
  }

  ngOnChanges(simpleChanges) {
    console.log(simpleChanges);
    this.countdown();
  }

}
