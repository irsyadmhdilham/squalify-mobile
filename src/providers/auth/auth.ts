import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

interface auth {
  auth: boolean;
  data: {
    user_id: number;
    agency_id: number;
    token: string;
  };
}

@Injectable()
export class AuthProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  authenticate(email: string, password: string, fcmToken: string): Observable<auth> {
    const url = this.otherUrl(`auth/`),
          data = { email, password, fcmToken };
    return this.http.post<auth>(url, data);
  }

}
