import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, TextInput, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import * as moment from "moment";
import { Subscription } from "rxjs/Subscription";

import { post } from "../../../models/post";
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
  likeListener: Subscription;
  unlikeListener: Subscription;
  commentListener: Subscription;

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
      this.postProvider.likePost(this.pk, { userId }).subscribe(observe => {
        this.likeId = observe.pk;
        this.liked = true;
        const like = {
          ...observe,
          liker: observe.liker.pk
        };
        this.likes.push(like);
        this.postProvider.likePostEmit(this.pk, like);
      });
    } else {
      if (this.likeId) {
        const i = this.likes.findIndex(val => val.liker === userId);
        this.postProvider.unlikePost(this.pk, this.likeId).subscribe(() => {
          this.likeId = undefined;
          this.liked = false;
          this.likes.splice(i, 1);
          this.postProvider.unlikePostEmit(this.pk);
        });
      }
    }
  }

  async checkLiked() {
    const userId = await this.postProvider.userId().toPromise();
    const likes = this.likes.filter(val => val.liker === userId);
    if (likes.length > 0) {
      this.likeId = likes[0].pk;
      this.liked = true;
    }
  }

  getComments() {
    this.postProvider.getComments(this.pk).subscribe(observe => {
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

  async websocket() {
    const userId = await this.postProvider.userId().toPromise();
    this.commentListener = this.postProvider.commentPost$.subscribe(data => {
      if (data.comment.commented_by.pk !== userId && data.postId !== this.pk) {
        this.comments.push(data.comment);
      }
    });

    this.likeListener = this.postProvider.likePost$.subscribe(data => {
      if (data.like.liker !== userId) {
        this.likes.push(data.like);
      }
    });

    this.unlikeListener = this.postProvider.unlikePost$.subscribe(data => {
      if (userId !== data.unliker) {
        const i = this.likes.findIndex(val => val.liker === data.unliker);
        this.likes.splice(i, 1);
      }
    });
  }

  ionViewDidLoad() {
    const post: post = this.navParams.get('post');
    this.index = this.navParams.get('index');
    this.pk = post.pk;
    this.name = post.posted_by.name;
    this.profileImage = post.posted_by.profile_image;
    this.postType = post.post_type;
    this.totalSales = post.sales_rel.map(val => parseFloat(val.amount)).reduce((a, b) => a + b);
    this.monthlySales = parseFloat(post.monthly_sales);
    this.date = new Date(post.timestamp);
    this.likes = post.likes;
    this.checkLiked();
    this.getComments();
    this.websocket();
  }

  async postComment() {
    const userId = await this.postProvider.userId().toPromise();
    if (this.message !== '') {
      const data = {
        userId,
        text: this.message
      };
      const loading = this.loadingCtrl.create({content: 'Please wait...'});
      loading.present();
      this.postProvider.postComment(this.pk, data).subscribe(observe => {
        loading.dismiss();
        const comment = {
          ...observe,
          timestamp: new Date(observe.timestamp)
        };
        this.message = '';
        this.comments.push(comment);
        this.postProvider.commentPostEmit(comment, this.pk);
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

  ionViewWillLeave() {
    this.navCtrl.getPrevious().data.likeStatus = {
      index: this.index,
      status: this.liked
    }
    this.navCtrl.getPrevious().data.navToDetail = false;
    this.likeListener.unsubscribe();
    this.unlikeListener.unsubscribe();
    this.commentListener.unsubscribe();
  }

}
