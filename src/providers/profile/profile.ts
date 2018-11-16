import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { apiBaseUrl } from "../../functions/config";
import { settings } from "../../interfaces/profile-settings";

interface getProfile {
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

  getProfile(): Observable<getProfile> {
    const url = `${apiBaseUrl()}/profile/${this.userId}`;
    return this.http.get<getProfile>(url);
  }

}
