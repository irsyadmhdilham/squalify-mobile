import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { schedule } from "../../interfaces/schedule";

@Injectable()
export class ScheduleProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  addSchedule(data: schedule): Observable<schedule> {
    const url = this.profileUrl('schedule/');
    return url.pipe(switchMap(url => {
      return this.http.post<schedule>(url, data)
    }));
  }

  getSchedules(): Observable<schedule[]> {
    const url = this.profileUrl('schedule?fields=pk,title,date,location');
    return url.pipe(switchMap(url => {
      return this.http.get<schedule[]>(url);
    }));
  }

  getScheduleDetail(scheduleId: number): Observable<schedule> {
    const url = this.profileUrl(`schedule/${scheduleId}`);
    return url.pipe(switchMap(url => {
      return this.http.get<schedule>(url);
    }));
  }

  removeSchedule(scheduleId: number): Observable<null> {
    const url = this.profileUrl(`schedule/${scheduleId}`);
    return url.pipe(switchMap(url => {
      return this.http.delete<null>(url);
    }));
  }

  updateSchedule(scheduleId: number, data: schedule): Observable<schedule> {
    const url = this.profileUrl(`schedule/${scheduleId}/`);
    return url.pipe(switchMap(url => {
      return this.http.put<schedule>(url, data);
    }));
  }

}
