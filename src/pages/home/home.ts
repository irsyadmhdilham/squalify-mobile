import { Component } from '@angular/core';
import {
  NavController,
  ModalController,
  NavParams,
  Events
} from 'ionic-angular';
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { mergeMap, map } from "rxjs/operators";
import { Subscription } from "rxjs/Subscription";

import { PostProvider } from "../../providers/post/post";
import { MemoProvider } from "../../providers/memo/memo";
import { post, comment } from "../../models/post";
import { profile } from "../../models/profile";
import { store } from "../../models/store";

import { PointInit } from "../../store/actions/points.action";
import { NotificationsPage } from '../notifications/notifications';
import { ComposeMemoComponent } from "../../components/compose-memo/compose-memo";

import { ContactsPage } from "../../pages/dashboard/contacts/contacts";
import { SchedulesPage } from "../../pages/dashboard/schedules/schedules";
import { PointsPage } from "../../pages/dashboard/points/points";
import { SalesPage } from "../../pages/dashboard/sales/sales";

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
  io: any;
  storeListener: Subscription;
  ioListener: Subscription;
  newPostListener: Subscription;
  commentPostListener: Subscription;
  likePostListener: Subscription;
  unlikePostListener: Subscription;
  navToDetail = false;
  commentEventListener: (postId: number, comment: comment) => void;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private postProvider: PostProvider,
    private navParams: NavParams,
    private store: Store<store>,
    private events: Events,
    private memoProvider: MemoProvider
  ) { }

  composeMemo() {
    const modal = this.modalCtrl.create(ComposeMemoComponent);
    modal.present();
    modal.onDidDismiss((post: post) => {
      if (post) {

      }
    });
  }

  navigate(section) {
    switch (section) {
      case 'contacts':
        this.navCtrl.push(ContactsPage);
      break;
      case 'schedules':
        this.navCtrl.push(SchedulesPage);
      break;
      case 'points':
        this.navCtrl.push(PointsPage);
      break;
      case 'sales':
        this.navCtrl.push(SalesPage);
      break;
    }
  }

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

  fetch() {
    this.memoProvider.getMemos().pipe(mergeMap(memos => {
      return this.postProvider.getPosts().pipe(map(posts => {
        return { posts: posts, memos: memos };
      }));
    })).subscribe(response => {
      const posts = response.posts,
            memos = response.memos;
      this.newPost = 0;
      this.posts.push({ memos });
      this.posts.push(...posts);
    });
  }

  homeWs() {
    this.newPostListener = this.postProvider.newPost$.subscribe(() => {
      this.newPost++;
    });
    
    this.commentPostListener = this.postProvider.commentPost$.subscribe(response => {
      const postId = response.postId,
            i = this.posts.findIndex(val => val.pk === postId);
      this.posts[i].comments.push(response.comment);
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
  }

  commentListener() {
    this.commentEventListener = (postId: number, comment: comment) => {
      const i = this.posts.findIndex(val => val.pk === postId);
      this.posts[i].comments.push(comment);
    };
    this.events.subscribe('post:comment post', this.commentEventListener);
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
    this.commentListener();
  }

  ionViewDidLoad() {
    this.postProvider.userId().subscribe(userId => {
      if (userId) {
        this.fetch();
        this.store.dispatch(new PointInit());
      }
    });
  }

  ionViewDidLeave() {
    if (!this.navToDetail) {
      this.storeListener.unsubscribe();
      this.newPostListener.unsubscribe();
      this.ioListener.unsubscribe();
      this.commentPostListener.unsubscribe();
      this.likePostListener.unsubscribe();
      this.events.unsubscribe('post:comment post', this.commentEventListener);
    }
  }
}
