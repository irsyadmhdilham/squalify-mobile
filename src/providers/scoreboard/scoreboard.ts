import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { salesScore, pointScore } from "../../interfaces/scoreboard";

import { ApiUrlModules } from "../../functions/config";

@Injectable()
export class ScoreboardProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getSalesScore(userId, period: string, salesType: string): Observable<salesScore[]> {
    let url = this.profileUrl(userId, `sales/agency/${period}/?q=${salesType}`);
    return this.http.get<salesScore[]>(url);
  }

  getPointScore(userId, period: string): Observable<pointScore[]> {
    const url = this.profileUrl(userId, `point/scoreboard/?q=${period}`);
    return this.http.get<pointScore[]>(url);
  }

}
