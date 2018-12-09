import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

interface auth {
  auth: boolean;
  data: {
    user_id: number;
    agency_id: number
  };
}

@Injectable()
export class AuthProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  authenticate(email: string, password: string, fcmToken: string): Observable<auth> {
    const url = this.otherUrl(`auth?email=${email}&password=${password}&fcmToken=${fcmToken}`);
    return this.http.get<auth>(url);
  }

}
