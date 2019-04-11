import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

interface auth {
  auth: boolean;
  data: {
    user_id: number;
    agency_id: number;
    token: string;
    fcm_id: number;
    hq: boolean;
  };
}

@Injectable()
export class AuthProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  authenticate(email: string, password: string, fcmToken: string): Observable<auth> {
    const url = this.otherUrl('auth/'),
          data = { email, password, fcmToken };
    const headers = new HttpHeaders({
      'Authorization': `${email}:${password}`
    });
    return this.http.post<auth>(url, data, { headers });
  }

  signOut(): Observable<{status: string}> {
    const url = this.otherUrl('auth/sign-out/');
    return this.userId().pipe(switchMap(userId => {
      return this.fcmId().pipe(switchMap(fcmId => {
        return this.httpOptions().pipe(switchMap(httpOptions => {
          return this.http.post<{status: string}>(url, { userId, fcmId }, httpOptions);
        }));
      }));
    }));
  }

}
