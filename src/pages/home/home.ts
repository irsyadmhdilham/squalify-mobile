import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import * as socketio from "socket.io-client";
import { Store, select } from "@ngrx/store";
import { Fetch } from "../../store/actions/profile.action";
import { Observable } from "rxjs";
import { Subscription } from "rxjs/Subscription";
import { map, catchError } from "rxjs/operators";

import { AgencyProvider } from "../../providers/agency/agency";
import { PostProvider } from "../../providers/post/post";
import { post } from "../../interfaces/post";
import { profile } from "../../interfaces/profile";

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

  agency: Observable<profile> = this.store.pipe(select('profile'));
  agencySubscription: Subscription;
  agencyName: string;
  pk: number;
  company: string;
  newPost = 0;
  posts: post[] = [];
  likeStatus: { index: number, status: boolean; };
  points = {
    personal: 0,
    group: 0,
    agency: 0
  };
  io = socketio(this.agencyProvider.wsBaseUrl('home'));

  constructor(
    public navCtrl: NavController,
    private agencyProvider: AgencyProvider,
    private modalCtrl: ModalController,
    private postProvider: PostProvider,
    private navParams: NavParams,
    private store: Store<profile>
  ) { }

  navToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  agencyImageView(): Observable<any> {
    return this.agency.pipe(map(value => {
      return {
        background: `url('${value.agency.agency_image}') center center no-repeat / cover`
      };
    }), catchError(err => err));
  }

  ionViewWillEnter() {
    const likeStatus = this.navParams.get('likeStatus');
    this.likeStatus = likeStatus;
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
      this.io.emit('new post', {
        namespace: `${this.company}:${this.pk}`
      });
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
    const namespace = `${this.company}:${this.pk}`;
    this.io.on(`${namespace}:new post`, () => {
      this.newPost++;
    });
    
    this.io.on(`${namespace}:comment post`, data => {
      const i = data.index;
      const post = this.posts[i];
      post.comments++;
    });

    this.io.on(`${namespace}:like post`, data => {
      const i = data.index,
            like = data.like;
      this.posts[i].likes.push(like);
    });

    this.io.on(`${namespace}:unlike post`, data => {
      const i = data.index,
            unliker = data.unliker;
      const post = this.posts[i],
            x = post.likes.findIndex(val => val.liker === unliker);
      post.likes.splice(x, 1);
    });

    this.io.on(`${namespace}:add agency point`, data => {
      this.points.agency += data.point;
    });

    this.io.on(`${namespace}:subtract agency point`, data => {
      this.points.agency -= data.point;
    });

    this.io.on(`${namespace}:add group point`, data => {
      this.points.group += data.point;
    });

    this.io.on(`${namespace}:subtract group point`, data => {
      this.points.group -= data.point;
    });
  }

  ionViewDidLoad() {
    this.store.dispatch(new Fetch());
    this.fetchPosts();
    this.agencySubscription = this.agency.subscribe(value => {
      this.pk = value.agency.pk;
      this.agencyName = value.agency.name;
      this.company = value.agency.company;
      this.homeWs();
    });
  }

  likePost() {
    return new Promise(async resolve => {
      const userId = await this.postProvider.userId().toPromise();
      this.postProvider.likePost(this.pk, { userId }).subscribe(observe => {
        resolve(observe);
      });
    });
  }

  unlikePost(postId, likeId) {
    return new Promise(resolve => {
      this.postProvider.unlikePost(postId, likeId).subscribe(() => {
        resolve();
      });
    })
  }

  ionViewDidLeave() {
    this.agencySubscription.unsubscribe();
  }
}
