import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { ApiUrlModules } from "../../functions/config";
import { profile } from "../../interfaces/profile";

@Injectable()
export class ProfileProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getProfile(): Observable<profile> {
    const url = this.profileUrl();
    return this.http.get<profile>(url);
  }

  updateProfile(data): Observable<profile> {
    const url = this.profileUrl();
    return this.http.put<profile>(url, data);
  }

  updatePushNotification(data): Observable<any> {
    const url = this.profileUrl('settings/push-notifications/');
    return this.http.put<any>(url, data)
  }

  updateEmailNotification(value): Observable<{Succeed: boolean}> {
    const url = this.profileUrl('settings/email-notification/');
    return this.http.put<{Succeed: boolean}>(url, value);
  }

}
