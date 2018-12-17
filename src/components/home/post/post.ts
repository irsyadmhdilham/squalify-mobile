import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { NavController } from "ionic-angular";

import { PostProvider } from "../../../providers/post/post";
import { PostDetailPage } from "../../../pages/home/post-detail/post-detail";
import { post } from "../../../interfaces/post";

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements OnChanges {

  @ViewChild('likeIcon') likeIcon: ElementRef;
  @Input() data: post;
  @Input() index: number;
  @Input() likePost: any;
  @Input() unlikePost: any;
  @Input() commentPost: any;
  @Input() company: string;
  @Input() likeStatus: { index: number; status: boolean; }
  pk: number;
  postType: string;
  name: string;
  profileImage: string;
  totalSales: number;
  monthlySales: number;
  date: Date = new Date();
  location: string;
  taggedUsers = [];
  comments: number;
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
    const userId = await this.postProvider.userId();
    if (!this.liked) {
      this.likePost().then(data => {
        this.likeId = data.pk;
        this.liked = true;
        const like = {
          ...data,
          liker: data.liker.pk
        };
        this.likes.push(like);
      });
    } else {
      if (this.likeId) {
        this.unlikePost(this.pk, this.likeId).then(() => {
          const i = this.likes.findIndex(val => val.liker === userId);
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
      company: this.company,
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
