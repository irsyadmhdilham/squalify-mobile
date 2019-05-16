import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { switchMap, map, take } from "rxjs/operators";
import { Storage } from "@ionic/storage";

import { ApiUrlModules } from "../../functions/config";

import { point, contactPoints, groupPoint, allPoints, pointIo, summary, summaryResponse } from "../../models/point";
import { store } from "../../models/store";
import { profile } from "../../models/profile";

@Injectable()
export class PointProvider extends ApiUrlModules {

  addPoint$ = new Subject<pointIo>();
  subtractPoint$ = new Subject<pointIo>();

  constructor(public http: HttpClient, public storage: Storage, private store: Store<store>) {
    super(storage);
  }

  addPointEmit(point: number) {
    this.store.pipe(select('profile'), switchMap((profile: profile) => {
      return this.store.pipe(select('io'), map((io: any) => {
        const agency = profile.agency;
        let upline: number;
        if (profile.upline) {
          upline = profile.upline.pk;
        }
        const members = agency.members.map(val => {
          return { userId: val, uplineId: upline };
        });
        return { io: io, namespace: `agency(${agency.pk})`, members: members, sender: profile.pk };
      }));
    }), take(1)).subscribe(response => {
      response.io.emit('point:add point', {
        point,
        sender: response.sender,
        members: response.members,
        namespace: response.namespace
      });
    });
  }

  subtractPointEmit(point: number) {
    this.store.pipe(select('profile'), switchMap((profile: profile) => {
      return this.store.pipe(select('io'), map((io: any) => {
        const agency = profile.agency;
        let upline: number;
        if (profile.upline) {
          upline = profile.upline.pk;
        }
        const members = agency.members.map(val => {
          return { userId: val, uplineId: upline };
        });
        return { io: io, namespace: `agency(${agency.pk})`, members: members, sender: profile.pk };
      }));
    }), take(1)).subscribe(response => {
      response.io.emit('point:subtract point', {
        point,
        sender: response.sender,
        members: response.members,
        namespace: response.namespace
      });
    });
  }

  createPoint(add: boolean, data: any): Observable<point> {
    const url = this.profileUrl('point/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.post<point>(url, { ...data, add }, httpOptions);
      }));
    }));
  }

  updatePoint(pointId: number, add: boolean, data: any): Observable<point> {
    const url = this.profileUrl(`point/${pointId}/?add=${add}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<point>(url, data, httpOptions);
      }));
    }));
  }

  getPoints(): Observable<point[]> {
    const url = this.profileUrl('point/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<point[]>(`${url}?fields=pk,date,total`, httpOptions);
      }));
    }));
  }

  getTodayPoint(): Observable<point[]> {
    const url = this.profileUrl('point/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<point[]>(`${url}?mode=today`, httpOptions);
      }));
    }));
  }

  getPointLogs(pointId: number): Observable<point> {
    const url = this.profileUrl(`point/${pointId}/?type=logs`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<point>(url, httpOptions);
      }));
    }));
  }

  getPointDetail(pointId: number): Observable<point> {
    const url = this.profileUrl(`point/${pointId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<point>(url, httpOptions);
      }));
    }));
  }

  getContactPoints(): Observable<contactPoints> {
    const url = this.profileUrl('point/contact/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<contactPoints>(url, httpOptions);
      }));
    }));
  }

  getGroupPoints(): Observable<point[]> {
    const url = this.profileUrl('point/group/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<point[]>(url, httpOptions);
      }));
    }));
  }

  fetchGroupMore(start: number): Observable<point[]> {
    const url = this.profileUrl(`point/group/?start=${start}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<point[]>(url, httpOptions);
      }));
    }));
  }

  getGroupMember(date: string): Observable<groupPoint[]> {
    const url = this.profileUrl(`point/group/${date}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<groupPoint[]>(url, httpOptions);
      }));
    }));
  }

  getDownlineGroupMember(date: string, userId: number): Observable<groupPoint[]> {
    const url = `${this.apiBaseUrl()}/profile/${userId}/point/group/${date}/`;
    return this.httpOptions().pipe(switchMap(httpOptions => {
      return this.http.get<groupPoint[]>(url, httpOptions);
    }));
  }

  getDownline(userId: number): Observable<point[]> {
    const url = `${this.apiBaseUrl()}/profile/${userId}/point/group/`;
    return this.httpOptions().pipe(switchMap(httpOptions => {
      return this.http.get<point[]>(url, httpOptions);
    }));
  }

  getDownlineMore(userId: number, start: number): Observable<point[]> {
    const url = `${this.apiBaseUrl()}/profile/${userId}/point/group/?start=${start}`;
    return this.httpOptions().pipe(switchMap(httpOptions => {
      return this.http.get<point[]>(url, httpOptions);
    }));
  }

  getAllPoints(): Observable<allPoints> {
    const url = this.profileUrl('point/all-points/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<allPoints>(url, httpOptions);
      }));
    }));
  }

  personalSummary(period: string, dateSelect?: { from: string; until: string }): Observable<summary> {
    const dateSelectFunc = () => {
      if (dateSelect) {
        return `&f=${dateSelect.from}&u=${dateSelect.until}`;
      }
      return '';
    };
    const url = this.profileUrl(`point/summary/?p=${period}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<summaryResponse>(url, httpOptions).pipe(map(response => {
          return {
            ...response,
            sales: {
              ...response.sales,
              total_new_sales: parseFloat(response.sales.total_new_sales)
            }
          };
        }));
      }));
    }));
  }

  groupSummary(period: string, dateSelect?: { from: string; until: string }): Observable<summary> {
    const dateSelectFunc = () => {
      if (dateSelect) {
        return `&f=${dateSelect.from}&u=${dateSelect.until}`;
      }
      return '';
    };
    const url = this.profileUrl(`point/group/summary/?p=${period}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<summaryResponse>(url, httpOptions).pipe(map(response => {
          return {
            ...response,
            sales: {
              ...response.sales,
              total_new_sales: parseFloat(response.sales.total_new_sales)
            }
          };
        }));
      }));
    }));
  }

  agenciesSummary(period: string): Observable<summary> {
    const url = this.otherUrl(`profile/2/point/headquaters/summary/?p=${period}`);
    return this.httpOptions().pipe(switchMap(httpOptions => {
      return this.http.get<summaryResponse>(url, httpOptions).pipe(map(response => {
        return {
          ...response,
          sales: {
            ...response.sales,
            total_new_sales: parseFloat(response.sales.total_new_sales)
          }
        };
      }));
    }));
  }

}
