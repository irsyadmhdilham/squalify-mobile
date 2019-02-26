import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

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
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.post<schedule>(url, data, httpOptions).pipe(map(response => ({
          ...response,
          date: new Date(response.date),
          reminder: response.reminder ? new Date(response.reminder) : response.reminder
        })))
      }));
    }));
  }

  getSchedules(): Observable<schedule[]> {
    const url = this.profileUrl('schedule/?fields=pk,title,date,location');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<schedule[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            date: new Date(value.date),
            reminder: value.reminder ? new Date(value.reminder) : value.reminder
          }));
        }));
      }));
    }));
  }

  getScheduleDetail(scheduleId: number): Observable<schedule> {
    const url = this.profileUrl(`schedule/${scheduleId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<schedule>(url, httpOptions).pipe(map(response => ({
          ...response,
          date: new Date(response.date),
          reminder: response.reminder ? new Date(response.reminder) : response.reminder
        })));
      }));
    }));
  }

  removeSchedule(scheduleId: number): Observable<null> {
    const url = this.profileUrl(`schedule/${scheduleId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.delete<null>(url, httpOptions);
      }));
    }));
  }

  updateSchedule(scheduleId: number, data: schedule): Observable<schedule> {
    const url = this.profileUrl(`schedule/${scheduleId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<schedule>(url, data, httpOptions).pipe(map(response => ({
          ...response,
          date: new Date(response.date),
          reminder: response.reminder ? new Date(response.reminder) : response.reminder
        })));
      }));
    }));
  }

  filterSchedule(title: string, location: string, remark: string, from: string, until: string): Observable<schedule[]> {
    const url = this.profileUrl(`schedule/filter/?t=${title}&l=${location}&r=${remark}&f=${from}&u=${until}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<schedule[]>(url, httpOptions);
      }));
    }));
  }

  getReminders(): Observable<schedule[]> {
    const url = this.profileUrl('schedule/reminders/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<schedule[]>(url, httpOptions);
      }));
    }));
  }

}
