import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

import { agency, member } from "../../models/agency";
import { post } from "../../models/post";

@Injectable()
export class AgencyProvider extends ApiUrlModules {

  constructor(
    public http: HttpClient,
    public storage: Storage
  ) {
    super(storage);
  }

  updateAgency(data): Observable<agency> {
    const url = this.agencyUrl();
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<agency>(url, data, httpOptions);
      }))
    }));
  }

  getAgencyDetail(fields?: string, userId?): Observable<agency> {
    let url = this.agencyUrl();
    if (fields) {
      url = this.agencyUrl(`?u=${userId}&fields=${fields}`);
    }
    return url.pipe(switchMap(value => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<agency>(value, httpOptions);
      }));
    }))
  }

  getPosts(): Observable<post[]> {
    const url = this.agencyUrl('post/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<post[]>(url, httpOptions);
      }));
    }));
  }

  getAgencyMembers(): Observable<member[]> {
    const url = this.agencyUrl('members/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<member[]>(url, httpOptions);
      }));
    }));
  }

}
