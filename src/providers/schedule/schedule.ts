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

}
