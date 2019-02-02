import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { schedule } from "../../models/schedule";

@Injectable()
export class ScheduleProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  addSchedule(data: schedule): Observable<schedule> {
    const url = this.profileUrl('schedule/');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.post<schedule>(url, data, { headers })
      }));
    }));
  }

  getSchedules(): Observable<schedule[]> {
    const url = this.profileUrl('schedule?fields=pk,title,date,location');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<schedule[]>(url, { headers });
      }));
    }));
  }

  getScheduleDetail(scheduleId: number): Observable<schedule> {
    const url = this.profileUrl(`schedule/${scheduleId}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<schedule>(url, { headers });
      }));
    }));
  }

  removeSchedule(scheduleId: number): Observable<null> {
    const url = this.profileUrl(`schedule/${scheduleId}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.delete<null>(url, { headers });
      }));
    }));
  }

  updateSchedule(scheduleId: number, data: schedule): Observable<schedule> {
    const url = this.profileUrl(`schedule/${scheduleId}/`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.put<schedule>(url, data, { headers });
      }));
    }));
  }

}
