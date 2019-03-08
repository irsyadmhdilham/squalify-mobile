import * as countdownjs from 'countdown';
import { memo as model } from "../../models/memo";

export class Memo {
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  text = this.memo.text;
  start_date = this.memo.start_date;
  end_date = this.memo.end_date;
  posted_by = this.memo.posted_by;
  posted_date = this.memo.posted_date;
  gotCountdown = this.memo.countdown;
  
  constructor(private memo: model) {
    this.counting();
  }

  counting() {
    if (this.memo.countdown) {
      setInterval(() => {
        const countdown = countdownjs(new Date(), this.memo.countdown);
        if (countdown.value > 0) {
          this.countdown = countdown;
        }
      }, 1000);
    }
  }

}