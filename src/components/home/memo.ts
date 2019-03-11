import * as countdownjs from 'countdown';
import { memo as model, like, comment } from "../../models/memo";
import { MemoProvider } from "../../providers/memo/memo";
import { mergeMap, map } from 'rxjs/operators';

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
  likes: like[] = this.memo.likes;
  comments: comment[] = this.memo.comments;
  liked = false;
  likeId: number;
  
  constructor(private memo: model, public memoProvider: MemoProvider) {
    this.counting();
    this.likeChecker();
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

  likeChecker() {
    this.memoProvider.userId().subscribe(userId => {
      const likes = this.likes.filter(val => val.liker === userId);
      if (likes.length > 0) {
        this.likeId = likes[0].pk;
        this.liked = true;
      }
    });
  }

  like() {
    if (this.liked) {
      this.memoProvider.userId().pipe(mergeMap(userId => {
        return this.memoProvider.unlike(this.likeId).pipe(map(() => {
          return userId;
        }));
      })).subscribe(userId => {
        const i = this.likes.findIndex(val => val.liker === userId);
        this.likeId = undefined;
        this.liked = false;
        this.likes.splice(i, 1);
      });
    } else {
      this.memoProvider.like(this.memo.pk).subscribe(response => {
        this.liked = true;
        this.likeId = response.pk;
        const like = {
          ...response,
          liker: response.liker.pk
        };
        this.likes.push(like);
      });
    }
  }

}