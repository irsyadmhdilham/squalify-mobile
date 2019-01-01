import { Component, Input, ViewChild, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { NavController } from "ionic-angular";
import * as moment from "moment";

import { PostProvider } from "../../../providers/post/post";
import { PostDetailPage } from "../../../pages/home/post-detail/post-detail";
import { post, comment } from "../../../models/post";

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
  date: Date = new Date();
  location: string;
  taggedUsers = [];
  comments: comment[];
  likes = [];
  liked = false;
  likeId: number;

  constructor(
    private postProvider: PostProvider,
    private navCtrl: NavController
  ) { }

  profileImageView() {
    if (this.profileImage) {
      return { background: `url('${this.profileImage}') no-repeat center center / cover` };
    }
    return false;
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
    this.totalSales = this.data.sales_rel.map(val => parseFloat(val.amount)).reduce((a, b) => a + b);
    this.date = new Date(this.data.timestamp);
    this.monthlySales = parseFloat(this.data.monthly_sales)
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
  }

}
