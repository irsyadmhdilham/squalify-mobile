import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

import { agency } from "../../interfaces/agency";
import { post } from "../../interfaces/post";

@Injectable()
export class AgencyProvider extends ApiUrlModules {

  constructor(
    public http: HttpClient,
    public storage: Storage
  ) {
    super(storage);
  }

  getAgencyDetail(agencyId, fields?: string, userId?): Observable<agency> {
    let url = this.agencyUrl(agencyId);
    if (fields) {
      url = this.agencyUrl(agencyId, `?u=${userId}&fields=${fields}`);
    }
    return this.http.get<agency>(url);
  }

  getPosts(agencyId): Observable<post[]> {
    const url = this.agencyUrl(agencyId, 'post');
    return this.http.get<post[]>(url);
  }

}
