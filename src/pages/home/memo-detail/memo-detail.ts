import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  TextInput,
  LoadingController,
  AlertController,
  Events
} from 'ionic-angular';
import { Store, select } from "@ngrx/store";
import { mergeMap, map } from "rxjs/operators";
import { MemoProvider } from "../../../providers/memo/memo";
import { PostProvider } from "../../../providers/post/post";
import { NotificationProvider } from "../../../providers/notification/notification";
import * as countdownjs from "countdown";

import { memo } from "../../../models/memo";
import { store } from "../../../models/store";
import { notification } from "../../../models/notification";

@Component({
  selector: 'page-memo-detail',
  templateUrl: 'memo-detail.html',
})
export class MemoDetailPage {

  @ViewChild('likeIcon') likeIcon: ElementRef;
  @ViewChild('textMessageArea') textarea: TextInput;
  pk: number;
  name: string;
  postedBy: number;
  profileImage: string;
  postedDate: Date;
  countdown: Date;
  likes = [];
  liked = false;
  likeId: number;
  comments = [];
  text: string;
  message = '';
  commentsLoaded = false;
  counting = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  userId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private memoProvider: MemoProvider,
    private store: Store<store>,
    private postProvider: PostProvider,
    private notificationProvider: NotificationProvider,
    private events: Events
  ) { }

  countingHandler() {
    if (this.countdown) {
      setInterval(() => {
        const countdown = countdownjs(new Date(), this.countdown);
        if (countdown.value > 0) {
          this.counting = countdown;
        }
      }, 1000);
    }
  }

  readNotif() {
    const notif: notification = this.navParams.get('notif');
    if (notif) {
      if (!notif.read) {
        this.notificationProvider.read(notif.pk).subscribe(() => {
          this.events.publish('notifications: read', notif.pk);
        });
      }
    }
  }

  ionViewDidLoad() {
    this.store.pipe(select('profile')).subscribe((profile: any) => {
      this.userId = profile.pk;
    });
    const memo: memo = this.navParams.get('memo');
    this.readNotif();
    this.memoProvider.memoDetail(memo.pk).subscribe(memo => {
      this.postedBy = memo.posted_by.pk;
      this.pk = memo.pk;
      this.name = memo.posted_by.name;
      this.profileImage = memo.posted_by.profile_image;
      this.postedDate = memo.posted_date;
      this.countdown = memo.countdown;
      this.likes = memo.likes;
      this.comments = memo.comments;
      this.text = memo.text;
      this.likeChecker();
      this.countingHandler();
    });
  }

  profileImageView() {
    if (this.profileImage) {
      return {
        background: `url('${this.profileImage}') no-repeat center center / cover`
      };
    }
  }

  commentProfileImage(img: string) {
    return {
      background: `url('${img}') no-repeat center center / cover`
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
      this.memoProvider.like(this.pk).subscribe(response => {
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

  postComment() {
    if (this.message !== '') {
      const loading = this.loadingCtrl.create({content: 'Please wait...'});
      loading.present();
      this.memoProvider.postComment(this.pk, this.message).subscribe(observe => {
        loading.dismiss();
        const comment = {
          ...observe,
          timestamp: new Date(observe.timestamp)
        };
        this.message = '';
        this.comments.push(comment);
      }, (err: Error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error has occured',
          subTitle: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
    } else {
      this.textarea.setFocus();
    }
  }

  removeComment(commentId: number, i: number) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Remove', handler: () => {
          const loading = this.loadingCtrl.create({content: 'Please wait...'});
          loading.present();
          this.postProvider.removeComment(commentId).subscribe(() => {
            this.comments.splice(i, 1);
            loading.dismiss();
          }, () => {
            loading.dismiss();
          });
        }, cssClass: 'danger-alert'}
      ]
    });
    confirm.present();
  }

  canRemove(id: number) {
    return this.userId === id;
  }

}
