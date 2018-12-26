import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { notification } from "../../models/notification";

@Injectable()
export class NotificationProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getNotifications(): Observable<notification[]> {
    const url = this.profileUrl('notification');
    return url.pipe(switchMap(url => {
      return this.http.get<notification[]>(url).pipe(
        map(value => {
          return value.map(val => {
            return {
              ...val,
              timestamp: new Date(val.timestamp)
            }
          });
        }))
    }));
  }

  getNotifsReadTotal(): Observable<number> {
    const url = this.profileUrl('notification/read');
    return url.pipe(switchMap(url => {
      return this.http.get<number>(url);
    }));
  }

}
