import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { NavController, LoadingController } from "ionic-angular";
import * as socketio from 'socket.io-client';

import { PostDetailPage } from "../../../pages/home/post-detail/post-detail";
import { PostProvider } from "../../../providers/post/post";
import { post } from "../../../interfaces/post";

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements OnChanges {

  @ViewChild('likeIcon') likeIcon: ElementRef;
  @Input() data: post;
  @Input() likeAfterDetail;
  @Input() company: string;
  @Input() index: number;
  pk: number;
  postType: string;
  name: string;
  profileImage: string;
  totalSales: number;
  monthlySales: number;
  date: Date = new Date();
  location: string;
  taggedUsers = [];
  liked = false;
  comments: number;
  likes = [];
  likeId: number;
  io = socketio(this.postProvider.wsBaseUrl('like'));

  constructor(
    private navCtrl: NavController,
    private postProvider: PostProvider,
    private loadingCtrl: LoadingController
  ) { }

  profileImageView() {
    if (this.profileImage) {
      return { background: `url('${this.profileImage}') no-repeat center center / cover` };
    }
    return false;
  }

  dateDisplay() {
    const year = this.date.getFullYear(),
          month = this.date.getMonth(),
          date = this.date.getDate();
    const currentYear = new Date().getFullYear(),
          currentMonth = new Date().getMonth(),
          currentDate = new Date().getDate();
    if (currentYear === year && currentMonth === month) {
      if (currentDate === date) {
        return {
          text: 'Today'
        };
      } else {
        return { text: false };
      }
    } else {
      return { text: false };
    }
  }

  async like() {
    this.likeIcon.nativeElement.classList.add('like-button');
    setTimeout(() => {
      this.likeIcon.nativeElement.classList.remove('like-button');
    }, 500);
    const agencyId = await this.postProvider.agencyId(),
          userId = await this.postProvider.userId();
    const loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    if (!this.liked) {
      this.postProvider.likePost(agencyId, this.pk, { userId }).subscribe(observe => {
        loading.dismiss();
        this.likeId = observe.pk;
        this.liked = true;
        const like = {
          ...observe,
          liker: observe.liker.pk
        };
        this.likes.push(like);
        this.io.emit('like', {
          namespace: `${this.company}:${agencyId}`,
          liker: userId,
          index: this.index,
          like: true,
          likeObj: like
        });
      });
    } else {
      if (this.likeId) {
        const i = this.likes.findIndex(val => val.liker === userId);
        this.postProvider.unlikePost(agencyId, this.pk, this.likeId).subscribe(() => {
          loading.dismiss();
          this.likeId = undefined;
          this.liked = false;
          this.likes.splice(i, 1);
          this.io.emit('like', {
            namespace: `${this.company}:${agencyId}`,
            index: this.index,
            like: false,
            liker: userId
          });
        });
      }
    }
  }

  async checkLiked() {
    const userId = await this.postProvider.userId();
    const likes = this.likes.filter(val => val.liker === userId);
    if (likes.length > 0) {
      this.likeId = likes[0].pk;
      this.liked = true;
    }
  }

  comment() {
    this.navCtrl.push(PostDetailPage, {
      index: this.index,
      post: this.data,
      company: this.company
    });
  }

  ngOnChanges() {
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
    if (this.likeAfterDetail) {
      if (this.pk === this.likeAfterDetail.postId) {
        this.liked = this.likeAfterDetail.liked;
        this.likeId = this.likeAfterDetail.likeId;
        this.likes = this.likeAfterDetail.likes;
      }
    }
  }

}
