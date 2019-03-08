import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ApiUrlModules } from "../../functions/config";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { memo } from "../../models/memo";

export interface memoData {
  userId?: number;
  startDate: Date;
  endDate: Date;
  countdown: Date;
  text: string;

}
interface memoResponse {
  pk: number;
  start_date: string;
  end_date: string;
  text: string;
  countdown: string;
  posted_date: string;
  posted_by: {
    name: string;
    profile_image: string;
  }
}

@Injectable()
export class MemoProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getMemos(): Observable<memo[]> {
    const url = this.agencyUrl('memo/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<memoResponse[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            posted_date: new Date(value.posted_date),
            start_date: new Date(value.start_date),
            end_date: new Date(value.end_date),
            countdown: value.countdown ? new Date(value.countdown) : null
          }));
        }));
      }));
    }));
  }

  postMemo(data: memoData): Observable<memo> {
    const url = this.agencyUrl('memo/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.userId().pipe(switchMap((userId: number) => {
          data.userId = userId;
          return this.http.post<memoResponse>(url, data, httpOptions).pipe(map(response => {
            return {
              ...response,
              posted_date: new Date(response.posted_date),
              start_date: new Date(response.start_date),
              end_date: new Date(response.end_date),
              countdown: response.countdown ? new Date(response.countdown) : null
            }
          }));
        }));
      }));
    }));
  }

  updateMemo(data: memoData, memoId: number): Observable<memo> {
    const url = this.agencyUrl(`memo/${memoId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<memoResponse>(url, data, httpOptions).pipe(map(response => {
          return {
            ...response,
            posted_date: new Date(response.posted_date),
            start_date: new Date(response.start_date),
            end_date: new Date(response.end_date),
            countdown: response.countdown ? new Date(response.countdown) : null
          }
        }));
      }));
    }));
  }

}
