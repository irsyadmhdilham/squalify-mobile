import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { switchMap, map, take } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { ApiUrlModules } from "../../functions/config";
import { Store, select } from "@ngrx/store";

import { comment, like, post } from "../../models/post";
import { owner } from "../../models/agency";
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

interface salesResponse {
  pk?: number;
  timestamp?: string;
  amount: string;
  sales_type: string;
  sales_status?: string;
  location?: string;
  commission?: string;
};

interface postResponse {
  pk: number,
  posted_by: owner;
  post_type: string;
  sales_rel: salesResponse[];
  timestamp: string;
  comments: comment[];
  likes: like[];
  monthly_sales: string;
};

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
    this.store.pipe(map(store => {
      const profile = store.profile,
            agency = profile.agency,
            members = agency.members,
            agencyId = agency.pk;
      return { io: store.io, namespace: `agency(${agencyId})`, sender: profile.pk, members };
    }), take(1)).subscribe(data => {
      data.io.emit('post:new post', {
        namespace: data.namespace,
        sender: data.sender,
        members: data.members
      });
    });
  }

  likePostEmit(postId: number, like: like, postedBy: number) {
    return this.store.pipe(select('profile')).pipe(
      switchMap((profile: profile) => {
        return this.store.pipe(select('io')).pipe(map((io: any) => {
          const agencyId = profile.agency.pk;
          return { io, namespace: `agency(${agencyId})`, members: profile.agency.members };
        }))
      })
    ).pipe(take(1))
    .subscribe(data => {
      data.io.emit('post:like post', {
        postId,
        namespace: data.namespace,
        like,
        members: data.members,
        postedBy
      });
    });
  }

  unlikePostEmit(postId: number) {
    this.store.pipe(select('profile')).pipe(
      switchMap((profile: profile) => {
        return this.store.pipe(select('io')).pipe(map((io: any) => {
          const agencyId = profile.agency.pk,
                userId = profile.pk;
          return { io, namespace: `agency(${agencyId})`, userId, members: profile.agency.members };
        }))
      })
    ).pipe(take(1)).subscribe(data => {
      data.io.emit('post:unlike post', {
        postId,
        namespace: data.namespace,
        unliker: data.userId,
        members: data.members
      });
    });
  }

  commentPostEmit(comment, postId: number, postedBy: number) {
    this.store.pipe(select('profile')).pipe(
      switchMap((profile: profile) => {
        return this.store.pipe(select('io')).pipe(map((io: any) => {
          const agencyId = profile.agency.pk,
                members = profile.agency.members;
          return { io, namespace: `agency(${agencyId})`, members };
        }))
      })
    ).pipe(take(1)).subscribe(data => {
      data.io.emit('post:comment post', {
        comment,
        postId,
        members: data.members,
        namespace: data.namespace,
        postedBy
      });
    });
  }

  getPosts(): Observable<post[]> {
    const url = this.agencyUrl('post/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<postResponse[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            timestamp: new Date(value.timestamp),
            monthly_sales: parseFloat(value.monthly_sales),
            sales_rel: value.sales_rel.map(val => ({
              ...val,
              amount: parseFloat(val.amount),
              commission: parseFloat(val.commission),
              timestamp: new Date(val.timestamp)
            }))
          }));
        }));
      }));
    }));
  }

  postComment(postId: number, data: any): Observable<comment> {
    const url = this.agencyUrl(`post/${postId}/comment/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.post<comment>(url, data, httpOptions);
      }));
    }));
  }

  getComments(postId: number): Observable<comment[]> {
    const url = this.agencyUrl(`post/${postId}/comment/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<comment[]>(url, httpOptions);
      }));
    }));
  }

  likePost(postId: number, data: { userId: any }): Observable<like> {
    const url = this.agencyUrl(`post/${postId}/like/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.post<like>(url, data, httpOptions);
      }));
    }));
  }

  unlikePost(postId: number, likeId: number): Observable<null> {
    const url = this.agencyUrl(`post/${postId}/unlike/${likeId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.delete<null>(url, httpOptions);
      }));
    }));
  }

  getPostDetail(postId: number): Observable<post> {
    const url = this.agencyUrl(`post/${postId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<postResponse>(url, httpOptions).pipe(map(response => {
          return {
            ...response,
            sales_rel: response.sales_rel.map(value => ({
              ...value,
              amount: parseFloat(value.amount),
              timestamp: new Date(value.timestamp),
              commission: parseFloat(value.commission)
            })),
            timestamp: new Date(response.timestamp),
            monthly_sales: parseFloat(response.monthly_sales)
          }
        }));
      }));
    }));
  }

}
