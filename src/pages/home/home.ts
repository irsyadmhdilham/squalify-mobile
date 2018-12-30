import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { Subscription } from "rxjs/Subscription";

import { AgencyProvider } from "../../providers/agency/agency";
import { PostProvider } from "../../providers/post/post";
import { post } from "../../models/post";
import { profile } from "../../models/profile";
import { store } from "../../models/store";

import { AddSalesComponent } from "../../components/sales/add-sales/add-sales";
import { AddContactComponent } from "../../components/contact/add-contact/add-contact";
import { AddScheduleComponent } from "../../components/schedule/add-schedule/add-schedule";
import { NotificationsPage } from '../notifications/notifications';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profile: profile;
  notifications: Observable<number> = this.store.pipe(select('notifications'));
  agencySubscription: Subscription;
  agencyName: string;
  agencyImage: string;
  agencyId: number;
  company: string;
  newPost = 0;
  posts: post[] = [];
  likeStatus: { index: number, status: boolean; };
  points = {
    personal: 0,
    group: 0,
    agency: 0
  };
  io: any;
  storeListener: Subscription;
  ioListener: Subscription;
  newPostListener: Subscription;
  commentPostListener: Subscription;
  likePostListener: Subscription;
  unlikePostListener: Subscription;
  navToDetail = false;

  constructor(
    public navCtrl: NavController,
    private agencyProvider: AgencyProvider,
    private modalCtrl: ModalController,
    private postProvider: PostProvider,
    private navParams: NavParams,
    private store: Store<store>
  ) { }

  navToDetailListener(value: boolean) {
    this.navToDetail = value;
  }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  agencyImageView() {
    if (this.agencyImage) {
      return {
        background: `url('${this.agencyImage}') center center no-repeat / cover`
      };
    }
    return false;
  }

  fetchPosts() {
    this.agencyProvider.getPosts().subscribe(observe => {
      this.newPost = 0;
      this.posts = observe;
    });
  }

  createPost(attribute) {
    const createModal = (component) => {
      return this.modalCtrl.create(component);
    };
    const newPost = () => {
      this.postProvider.newPostEmit();
    }
    switch (attribute) {
      case 'sales':
        const sales = createModal(AddSalesComponent);
        sales.present();
        sales.onDidDismiss(data => {
          if (data) {
            newPost();
          }
        });
      break;
      case 'contact':
        const contact = createModal(AddContactComponent);
        contact.present();
      break;
      case 'schedule':
        const schedule = createModal(AddScheduleComponent);
        schedule.present();
      break;
    }
  }

  homeWs() {
    this.newPostListener = this.postProvider.newPost$.subscribe(() => {
      this.newPost++;
    });
    
    this.commentPostListener = this.postProvider.commentPost$.subscribe(response => {
      const postId = response.postId,
            i = this.posts.findIndex(val => val.pk === postId),
            post = this.posts[i];
      post.comments++;
    });

    this.likePostListener = this.postProvider.likePost$.subscribe(response => {
      const postId = response.postId,
            like = response.like;
      const i = this.posts.findIndex(val => val.pk === postId);
      this.posts[i].likes.push(like);
    });

    this.unlikePostListener = this.postProvider.unlikePost$.subscribe(response => {
      const postId = response.postId,
            unliker = response.unliker,
            i = this.posts.findIndex(val => val.pk === postId);
      const post = this.posts[i],
            x = post.likes.findIndex(val => val.liker === unliker);
      post.likes.splice(x, 1);
    });

    // this.io.on(`${namespace}:add agency point`, data => {
    //   this.points.agency += data.point;
    // });

    // this.io.on(`${namespace}:subtract agency point`, data => {
    //   this.points.agency -= data.point;
    // });

    // this.io.on(`${namespace}:add group point`, data => {
    //   this.points.group += data.point;
    // });

    // this.io.on(`${namespace}:subtract group point`, data => {
    //   this.points.group -= data.point;
    // });
  }

  ionViewWillEnter() {
    const likeStatus = this.navParams.get('likeStatus');
    const navToDetail = this.navParams.get('navToDetail');
    this.navToDetail = navToDetail;
    this.likeStatus = likeStatus;
    this.ioListener = this.store.pipe(select('io')).subscribe(io => {
      this.io = io;
    });
    this.storeListener = (this.store.pipe(select('profile')) as Observable<profile>)
    .subscribe(profile => {
      this.profile = profile
      this.agencyId = profile.agency.pk;
      this.agencyName = profile.agency.name;
      this.company = profile.agency.company;
      this.agencyImage = profile.agency.agency_image;
    });
    this.homeWs();
  }

  ionViewDidLoad() {
    this.fetchPosts();
  }

  ionViewDidLeave() {
    if (!this.navToDetail) {
      this.storeListener.unsubscribe();
      this.newPostListener.unsubscribe();
      this.ioListener.unsubscribe();
      this.commentPostListener.unsubscribe();
      this.likePostListener.unsubscribe();
    }
  }
}
