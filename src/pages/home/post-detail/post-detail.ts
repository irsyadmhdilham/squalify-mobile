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
  index: number;
  pk: number;
  postType: string;
  name: string;
  profileImage: string;
  totalSales: number;
  monthlySales: number;
  date: Date = new Date();
  location: string;
  taggedUsers = [];
  likes = [];
  liked = false;
  likeId: number;
  comments = [];
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
    const index = this.navParams.get('index');
    this.index = index;
    this.pk = post.pk;
    this.name = post.posted_by.name;
    this.profileImage = post.posted_by.profile_image;
    this.postType = post.post_type;
    this.totalSales = parseFloat(post.sales_rel.amount);
    this.monthlySales = 0;
    this.date = new Date(post.timestamp);
    this.location = post.sales_rel.location;
    this.likes = post.likes;
    this.checkLiked();
    this.getComments();
  }

  ionViewWillLeave() {
    this.navCtrl.getPrevious().data.like = {
      postId: this.pk,
      liked: this.liked,
      likeId: this.likeId
    };
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
