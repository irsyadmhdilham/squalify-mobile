import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { switchMap, map, take } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { ApiUrlModules } from "../../functions/config";
import { Store, select } from "@ngrx/store";

import { comment, like } from "../../models/post";
import { profile } from "../../models/profile";
import { store } from "../../models/store";

export interface commentPost {
  postId: number;
  comment: comment;
}

export interface likePost {
  postId: number;
  like: like;
}

export interface unlikePost {
  postId: number;
  unliker: number;
}

@Injectable()
export class PostProvider extends ApiUrlModules {

  newPost$ = new Subject();
  commentPost$ = new Subject<commentPost>();
  likePost$ = new Subject<likePost>();
  unlikePost$ = new Subject<unlikePost>();

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private store: Store<store>
  ) {
    super(storage);
  }

  newPostEmit() {
    this.store.pipe(select('profile')).pipe(
      switchMap((profile: profile) => {
        return this.store.pipe(select('io')).pipe(map((io: any) => {
          const agencyId = profile.agency.pk;
          return { io, namespace: `agency(${agencyId})`};
        }))
      })
    ).pipe(take(1)).subscribe(data => {
      data.io.emit('post:new post', { namespace: data.namespace });
    });
  }

  likePostEmit(postId: number, like: like) {
    this.store.pipe(select('profile')).pipe(
      switchMap((profile: profile) => {
        return this.store.pipe(select('io')).pipe(map((io: any) => {
          const agencyId = profile.agency.pk;
          return { io, namespace: `agency(${agencyId})`};
        }))
      })
    ).pipe(take(1)).subscribe(data => {
      data.io.emit('post:like post', { postId, namespace: data.namespace, like });
    });
  }

  unlikePostEmit(postId: number) {
    this.store.pipe(select('profile')).pipe(
      switchMap((profile: profile) => {
        return this.store.pipe(select('io')).pipe(map((io: any) => {
          const agencyId = profile.agency.pk,
                userId = profile.pk;
          return { io, namespace: `agency(${agencyId})`, userId };
        }))
      })
    ).pipe(take(1)).subscribe(data => {
      data.io.emit('post:unlike post', { postId, namespace: data.namespace, unliker: data.userId });
    });
  }

  commentPostEmit(comment, postId: number) {
    this.store.pipe(select('profile')).pipe(
      switchMap((profile: profile) => {
        return this.store.pipe(select('io')).pipe(map((io: any) => {
          const agencyId = profile.agency.pk,
                userId = profile.pk;
          return { io, namespace: `agency(${agencyId}):user(${userId})`};
        }))
      })
    ).pipe(take(1)).subscribe(data => {
      data.io.emit('post:comment post', { comment, postId });
    });
  }

  postComment(postId: number, data: any): Observable<comment> {
    const url = this.agencyUrl(`post/${postId}/comment/`);
    return url.pipe(switchMap(url => {
      return this.http.post<comment>(url, data);
    }));
  }

  getComments(postId: number): Observable<comment[]> {
    const url = this.agencyUrl(`post/${postId}/comment`);
    return url.pipe(switchMap(url => {
      return this.http.get<comment[]>(url);
    }));
  }

  likePost(postId: number, data: { userId: any }): Observable<like> {
    const url = this.agencyUrl(`post/${postId}/like/`);
    return url.pipe(switchMap(url => {
      return this.http.post<like>(url, data);
    }));
  }

  unlikePost(postId: number, likeId: number): Observable<null> {
    const url = this.agencyUrl(`post/${postId}/unlike/${likeId}`);
    return url.pipe(switchMap(url => {
      return this.http.delete<null>(url);
    }));
  }

}
