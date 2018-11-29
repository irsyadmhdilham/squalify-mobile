import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController } from "ionic-angular";

import { PostDetailPage } from "../../../pages/home/post-detail/post-detail";
import { PostProvider } from "../../../providers/post/post";
import { post } from "../../../interfaces/post";

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {

  @ViewChild('likeIcon') likeIcon: ElementRef;
  @Input() data: post;
  pk: number;
  postType: string;
  name: string;
  profileImage: string;
  totalSales: number;
  monthlySales = 0;
  date: Date = new Date();
  location: string;
  taggedUsers = [];
  liked = false;
  comments: number;
  likes = [];
  likeId: number;

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
        this.likes.push(observe);
      });
    } else {
      if (this.likeId) {
        const i = this.likes.findIndex(val => val.liker === userId);
        this.postProvider.unlikePost(agencyId, this.pk, this.likeId).subscribe(observe => {
          loading.dismiss();
          this.likeId = undefined;
          this.liked = false;
          this.likes.splice(i, 1);
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
      post: this.data
    });
  }

  ngOnChanges() {
    this.postType = this.data.post_type;
    this.name = this.data.posted_by.name;
    this.profileImage = this.data.posted_by.profile_image;
    this.totalSales = parseFloat(this.data.sales_rel.amount);
    this.date = new Date(this.data.timestamp);
    this.location = this.data.sales_rel.location;
    this.comments = this.data.comments;
    this.likes = this.data.likes;
    this.pk = this.data.pk;
    this.checkLiked();
  }

}
