import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { profile } from "../../models/profile";

@Injectable()
export class ProfileProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getProfile(): Observable<profile> {
    const url = this.profileUrl();
    return url.pipe(switchMap(url => {
      return this.http.get<profile>(url);
    }));
  }

  updateProfile(data): Observable<profile> {
    const url = this.profileUrl();
    return url.pipe(switchMap(url => {
      return this.http.put<profile>(url, data);
    }));
  }

  updatePushNotification(data): Observable<any> {
    const url = this.profileUrl('settings/push-notifications/');
    return url.pipe(switchMap(url => {
      return this.http.put<any>(url, data)
    }));
  }

  updateEmailNotification(value): Observable<{Succeed: boolean}> {
    const url = this.profileUrl('settings/email-notification/');
    return url.pipe(switchMap(url => {
      return this.http.put<{Succeed: boolean}>(url, value);
    }));
  }

  signOut(): Observable<{status: string}> {
    const url = this.profileUrl('sign-out/');
    return url.pipe(switchMap(url => {
      return this.http.put<{status: string}>(url, {});
    }));
  }

}
