import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, TextInput, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { post } from "../../../interfaces/post";
import { PostProvider } from "../../../providers/post/post";

@IonicPage()
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
})
export class PostDetailPage {

  @ViewChild('likeIcon') likeIcon: ElementRef;
  @ViewChild('textMessageArea') textarea: TextInput;
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
  comments = [];
  likes: number;
  message = '';
  commentsLoaded = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private postProvider: PostProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
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

  like() {
    this.likeIcon.nativeElement.classList.add('like-button');
    setTimeout(() => {
      this.likeIcon.nativeElement.classList.remove('like-button');
    }, 500);
    setTimeout(() => {
      if (this.liked) {
        this.liked = false;
      } else {
        this.liked = true;
      }
    }, 250);
  }

  async getComments() {
    const agencyId = await this.postProvider.agencyId();
    this.postProvider.getComments(agencyId, this.pk).subscribe(observe => {
      this.commentsLoaded = true;
      const comments = observe.map(val => {
        return {
          ...val,
          timestamp: new Date(val.timestamp)
        };
      });
      this.comments = comments;
    });
  }

  commentProfileImage(image) {
    if (image) {
      return { background: `url('${image}') center center no-repeat / cover` };
    }
    return false;
  }

  ionViewDidLoad() {
    const post: post = this.navParams.get('post');
    this.pk = post.pk;
    this.name = post.posted_by.name;
    this.profileImage = post.posted_by.profile_image;
    this.postType = post.post_type;
    this.totalSales = parseFloat(post.sales_rel.amount);
    this.monthlySales = 0;
    this.date = new Date(post.timestamp);
    this.location = post.sales_rel.location;
    this.likes = post.likes;
    this.getComments();
  }

  async postComment() {
    const userId = await this.postProvider.userId();
    const agencyId = await this.postProvider.agencyId();
    if (this.message !== '') {
      const data = {
        userId,
        text: this.message
      };
      const loading = this.loadingCtrl.create({content: 'Please wait...'});
      loading.present();
      this.postProvider.postComment(agencyId, this.pk, data).subscribe(observe => {
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

}
