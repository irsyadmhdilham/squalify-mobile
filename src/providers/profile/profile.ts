import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { settings } from "../../interfaces/profile-settings";
import { ApiUrlModules } from "../../functions/config";

interface profile {
  pk: number;
  group: number;
  name: string;
  designation: string;
  profile_image: string;
  agency: {
    pk: number;
    agency_image: string;
    name: string;
    company: string;
  },
  settings: settings;
}

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

}
