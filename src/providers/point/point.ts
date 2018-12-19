import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
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

  createPoint(add: boolean, data: any): Observable<point> {
    const url = this.profileUrl('point/');
    return url.pipe(switchMap(url => {
      return this.http.post<point>(url, { ...data, add });
    }));
  }

  updatePoint(pointId: number, add: boolean, data: any): Observable<point> {
    const url = this.profileUrl(`point/${pointId}/?add=${add}`);
    return url.pipe(switchMap(url => {
      return this.http.put<point>(url, data);
    }));
  }

  getPoints(): Observable<point[]> {
    const url = this.profileUrl('point');
    return url.pipe(switchMap(url => {
      return this.http.get<point[]>(`${url}?fields=pk,date,total`);
    }));
  }

  getTodayPoint(): Observable<point[]> {
    const url = this.profileUrl('point');
    return url.pipe(switchMap(url => {
      return this.http.get<point[]>(`${url}?mode=today`);
    }));
  }

  getPointLogs(pointId: number): Observable<point> {
    const url = this.profileUrl(`point/${pointId}?type=point_logs`);
    return url.pipe(switchMap(url => {
      return this.http.get<point>(url);
    }));
  }

  getPointDetail(pointId: number): Observable<point> {
    const url = this.profileUrl(`point/${pointId}`);
    return url.pipe(switchMap(url => {
      return this.http.get<point>(url);
    }));
  }

  getContactPoints(): Observable<contactPoints> {
    const url = this.profileUrl('point/contact');
    return url.pipe(switchMap(url => {
      return this.http.get<contactPoints>(url);
    }));
  }

  getGroupPoints(): Observable<groupPoint[]> {
    const url = this.profileUrl('point/group');
    return url.pipe(switchMap(url => {
      return this.http.get<groupPoint[]>(url);
    }));
  }

  getGroupMemberPoints(memberId: number): Observable<memberPoints[]> {
    const url = this.profileUrl(`point/group/${memberId}`);
    return url.pipe(switchMap(url => {
      return this.http.get<memberPoints[]>(url);
    }));
  }

  getDownline(memberId: number): Observable<groupPoint[]> {
    const url = this.profileUrl(`point/group/${memberId}/downline`);
    return url.pipe(switchMap(url => {
      return this.http.get<groupPoint[]>(url);
    }));
  }

}
