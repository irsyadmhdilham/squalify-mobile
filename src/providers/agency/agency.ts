import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

import { agency } from "../../interfaces/agency";

@Injectable()
export class AgencyProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getAgencyDetail(userId, agencyId, fields?: string): Observable<agency> {
    let url = this.agencyUrl(agencyId, `?u=${userId}`);
    if (fields) {
      url = this.agencyUrl(agencyId, `?u=${userId}&fields=${fields}`);
    }
    return this.http.get<agency>(url);
  }

}
