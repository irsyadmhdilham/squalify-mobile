import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

import { point, allPoints, contactPoints } from "../../interfaces/point";

@Injectable()
export class PointProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  createPoint(userId, add: boolean, data: any): Observable<point> {
    const url = this.profileUrl(userId, 'point/');
    return this.http.post<point>(url, { ...data, add });
  }

  updatePoint(userId, pointId: number, add: boolean, data: any): Observable<point> {
    const url = this.profileUrl(userId, `point/${pointId}?add=${add}`);
    return this.http.put<point>(url, data);
  }

  getPoints(userId): Observable<point[]> {
    const url = this.profileUrl(userId, 'point');
    return this.http.get<point[]>(`${url}?mode=all`);
  }

  getTodayPoint(userId): Observable<point[]> {
    const url = this.profileUrl(userId, 'point');
    return this.http.get<point[]>(`${url}?mode=today`);
  }

  getPointLogs(userId, pointId: number): Observable<point> {
    const url = this.profileUrl(userId, `point/${pointId}?type=logs`);
    return this.http.get<point>(url);
  }

  getAllPoints(userId): Observable<allPoints> {
    const url = this.profileUrl(userId, 'point/all');
    return this.http.get<allPoints>(url);
  }

  getContactPoints(userId): Observable<contactPoints> {
    const url = this.profileUrl(userId, 'point/contact');
    return this.http.get<contactPoints>(url);
  }

}
