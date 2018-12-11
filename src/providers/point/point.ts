import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

import { point, contactPoints, groupPoint } from "../../interfaces/point";

interface memberPoints {
  date: string;
  point: number
};

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
    const url = this.profileUrl(userId, `point/${pointId}/?add=${add}`);
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

  getContactPoints(userId): Observable<contactPoints> {
    const url = this.profileUrl(userId, 'point/contact');
    return this.http.get<contactPoints>(url);
  }

  getGroupPoints(userId): Observable<groupPoint[]> {
    const url = this.profileUrl(userId, 'point/group');
    return this.http.get<groupPoint[]>(url);
  }

  getGroupMemberPoints(userId, memberId: number): Observable<memberPoints[]> {
    const url = this.profileUrl(userId, `point/group/${memberId}`);
    return this.http.get<memberPoints[]>(url);
  }

}
