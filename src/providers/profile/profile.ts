import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { ApiUrlModules } from "../../functions/config";
import { profile } from "../../interfaces/profile";

@Injectable()
export class ProfileProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage)
  }

  getProfile(userId): Observable<profile> {
    const url = this.profileUrl(userId);
    return this.http.get<profile>(url);
  }

  updateProfile(userId, data): Observable<profile> {
    const url = this.profileUrl(userId);
    return this.http.put<profile>(url, data);
  }

  updatePushNotification(userId, data): Observable<any> {
    const url = this.profileUrl(userId, 'settings/push-notifications/');
    return this.http.put<any>(url, data)
  }

  updateEmailNotification(userId, value): Observable<{Succeed: boolean}> {
    const url = this.profileUrl(userId, 'settings/email-notification/');
    return this.http.put<{Succeed: boolean}>(url, value);
  }

  getUplineGroup(userId): Observable<profile> {
    const url = this.profileUrl(userId, '?fields=upline_group,agency');
    return this.http.get<profile>(url);
  }

}
