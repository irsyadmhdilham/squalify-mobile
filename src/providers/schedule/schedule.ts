import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { ApiUrlModules } from "../../functions/config";
import { schedule } from "../../interfaces/schedule";

@Injectable()
export class ScheduleProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  addSchedule(userId: number, data: schedule): Observable<schedule> {
    const url = this.profileUrl(userId, 'schedule/');
    return this.http.post<schedule>(url, data)
  }

  getSchedules(userId: number): Observable<schedule[]> {
    const url = this.profileUrl(userId, 'schedule?fields=pk,title,date,location');
    return this.http.get<schedule[]>(url);
  }

  getScheduleDetail(userId: number, scheduleId: number): Observable<schedule> {
    const url = this.profileUrl(userId, `schedule/${scheduleId}`);
    return this.http.get<schedule>(url);
  }

  removeSchedule(userId: number, scheduleId: number): Observable<null> {
    const url = this.profileUrl(userId, `schedule/${scheduleId}`);
    return this.http.delete<null>(url);
  }

  updateSchedule(userId: number, scheduleId: number, data: schedule): Observable<schedule> {
    const url = this.profileUrl(userId, `schedule/${scheduleId}`);
    return this.http.put<schedule>(url, data);
  }

}
