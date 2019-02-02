import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { salesScore, pointScore } from "../../models/scoreboard";

import { ApiUrlModules } from "../../functions/config";

@Injectable()
export class ScoreboardProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getSalesScore(period: string, salesType: string): Observable<salesScore[]> {
    let url = this.profileUrl(`sales/agency/${period}/?q=${salesType}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<salesScore[]>(url, { headers });
      }));
    }), map(value => {
      return value.map((val: any) => {
        return {
          ...val,
          amount: parseFloat(val.amount)
        }
      });
    }));
  }

  getPointScore(period: string): Observable<pointScore[]> {
    const url = this.profileUrl(`point/scoreboard/?q=${period}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<pointScore[]>(url, { headers });
      }));
    }));
  }

}
