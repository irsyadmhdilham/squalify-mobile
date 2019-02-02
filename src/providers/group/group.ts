import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';

import { ApiUrlModules } from "../../functions/config";
import { group } from "../../models/group";

@Injectable()
export class GroupProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getGroupDetail(userId?: number): Observable<group> {
    const url = this.profileUrl('group', userId);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<group>(url, { headers });
      }));
    }));
  }
}
