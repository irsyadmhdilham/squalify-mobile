import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { apiBaseUrl } from "../../functions/config";
import { settings } from "../../interfaces/profile-settings";

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
export class ProfileProvider {

  userId = '15';

  constructor(public http: HttpClient) { }

  getProfile(): Observable<profile> {
    const url = `${apiBaseUrl()}/profile/${this.userId}`;
    return this.http.get<profile>(url);
  }

  updateProfile(data): Observable<profile> {
    const url = `${apiBaseUrl()}/profile/${this.userId}`;
    return this.http.put<profile>(url, data);
  }

}
