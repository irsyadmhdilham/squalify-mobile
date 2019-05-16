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

  getSalesScore(period: string, salesType: string, dateSelect?: { from: Date; until: Date; }): Observable<salesScore[]> {
    function dateSelectFunc() {
      if (dateSelect) {
        return `&f=${dateSelect.from.toISOString()}&u=${dateSelect.until.toISOString()}`;
      }
      return '';
    }
    let url = this.agencyUrl(`scoreboard/?st=${salesType}&p=${period}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<salesScore[]>(url, httpOptions);
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

  getPointScore(period: string, dateSelect?: { from: Date; until: Date; }): Observable<pointScore[]> {
    function dateSelectFunc() {
      if (dateSelect) {
        return `&f=${dateSelect.from.toISOString()}&u=${dateSelect.until.toISOString()}`;
      }
      return '';
    }
    const url = this.profileUrl(`point/scoreboard/?q=${period}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<pointScore[]>(url, httpOptions);
      }));
    }));
  }

}
