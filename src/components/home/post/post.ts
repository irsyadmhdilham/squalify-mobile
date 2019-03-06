import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { NavController, ModalController } from "ionic-angular";
import * as moment from "moment";
const countdownjs = require('countdown');

import { PostProvider } from "../../../providers/post/post";
import { PostDetailPage } from "../../../pages/home/post-detail/post-detail";
import { post, comment } from "../../../models/post";

import { ComposeMemoComponent } from "../../compose-memo/compose-memo";

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements OnChanges {

  @ViewChild('likeIcon') likeIcon: ElementRef;
  @Input() data: post;
  @Input() index: number;
  @Input() likeStatus: { index: number; status: boolean; }
  @Output() navToDetail = new EventEmitter();
  pk: number;
  postType: string;
  name: string;
  profileImage: string;
  totalSales: number;
  monthlySales: number;
  date: Date;
  location: string;
  taggedUsers = [];
  comments: comment[];
  likes = [];
  liked = false;
  likeId: number;
  memo = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  constructor(
    private postProvider: PostProvider,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  profileImageView() {
    if (this.profileImage) {
      return { background: `url('${this.profileImage}') no-repeat center center / cover` };
    }
    return false;
  }

  countdown() {
    if (this.data.memo) {
      if (this.data.memo.countdown) {
        countdownjs(new Date(this.data.memo.countdown), data => {
          this.memo.days = data.days;
          this.memo.hours = data.hours;
          this.memo.minutes = data.minutes;
          this.memo.seconds = data.seconds;
        });
      }
    }
  }

  dateDisplay() {
    const timestamp = moment(this.date).fromNow();
    return timestamp;
  }

  async like() {
    this.likeIcon.nativeElement.classList.add('like-button');
    setTimeout(() => {
      this.likeIcon.nativeElement.classList.remove('like-button');
    }, 500);
    const userId = await this.postProvider.userId().toPromise();
    if (!this.liked) {
      this.postProvider.likePost(this.pk, { userId }).subscribe(async data => {
        this.likeId = data.pk;
        this.liked = true;
        const like = {
          ...data,
          liker: data.liker.pk
        };
        this.likes.push(like);
        this.postProvider.likePostEmit(this.pk, like, this.data.posted_by.pk);
      });
    } else {
      if (this.likeId) {
        this.postProvider.unlikePost(this.pk, this.likeId).subscribe(() => {
          const i = this.likes.findIndex(val => val.liker === userId);
          this.likeId = undefined;
          this.liked = false;
          this.likes.splice(i, 1);
          this.postProvider.unlikePostEmit(this.pk);
        });
      }
    }
  }

  checkLiked() {
    this.postProvider.userId().subscribe(userId => {
      const likes = this.likes.filter(val => val.liker === userId);
      if (likes.length > 0) {
        this.likeId = likes[0].pk;
        this.liked = true;
      }
    });
  }

  comment() {
    this.navToDetail.next(true);
    this.navCtrl.push(PostDetailPage, {
      post: this.data,
      index: this.index
    });
  }

  async ngOnChanges() {
    this.postType = this.data.post_type;
    this.name = this.data.posted_by.name;
    this.profileImage = this.data.posted_by.profile_image;
    this.totalSales = (() => {
      if (!this.data.memo) {
        return this.data.sales_rel.map(val => val.amount).reduce((a, b) => a + b);
      }
      return 0;
    })();
    this.date = this.data.timestamp;
    this.monthlySales = this.data.monthly_sales
    this.comments = this.data.comments;
    this.likes = this.data.likes;
    this.pk = this.data.pk;
    this.checkLiked();
    const likeStats = this.likeStatus;
    if (likeStats) {
      if (likeStats.index === this.index) {
        this.liked = likeStats.status;
      }
    }
    this.countdown();
  }

  editMemo() {
    const modal = this.modalCtrl.create(ComposeMemoComponent, { edit: true, memo: this.data.memo, postId: this.pk });
    modal.present();
    modal.onDidDismiss((data: post) => {
      if (data) {
        const memo = data.memo;
        this.data.memo = memo;
      }
    });
  }

}
