import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

import { point } from "../../interfaces/point";

@Injectable()
export class PointProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  createPoint(userId: number, data: any): Observable<any> {
    const url = this.profileUrl(userId, 'point/');
    return this.http.post<any>(url, data);
  }

  updatePoint(userId: number, pointId: number, data: any): Observable<point> {
    const url = this.profileUrl(userId, `point/${pointId}`);
    return this.http.put<point>(url, data);
  }

  getPoints(userId: number): Observable<point[]> {
    const url = this.profileUrl(userId, 'point');
    return this.http.get<point[]>(`${url}?mode=all`);
  }

  getTodayPoint(userId: number): Observable<point[]> {
    const url = this.profileUrl(userId, 'point');
    return this.http.get<point[]>(`${url}?mode=today`);
  }

}
