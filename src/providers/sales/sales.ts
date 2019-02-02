import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { switchMap, map, take } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { sales, summary, groupSales, downlineSales, salesIo } from "../../models/sales";
import { store } from "../../models/store";

@Injectable()
export class SalesProvider extends ApiUrlModules {

  addSales$ = new Subject<salesIo>();

  constructor(public http: HttpClient, public storage: Storage, private store: Store<store>) {
    super(storage);
  }

  addSalesEmit(amount) {
    this.store.pipe(map(store => {
      const profile = store.profile,
            agency = profile.agency,
            io = store.io;
      return { namespace: `agency(${agency.pk})`, io, sender: profile.pk, members: agency.members };
    }), take(1)).subscribe(response => {
      response.io.emit('sales:add sales', {
        amount,
        namespace: response.namespace,
        sender: response.sender,
        members: response.members
      });
    });
  }

  createSales(data: sales): Observable<sales> {
    const url = this.profileUrl('sales/');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.post<sales>(url, data, { headers });
      }));
    }));
  }

  getSales(period: string, salesType: string): Observable<sales[]> {
    const url = this.profileUrl(`sales/?p=${period}&t=${salesType}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<sales[]>(url, { headers });
      }));
    }));
  }

  removeSales(salesId): Observable<null> {
    const url = this.profileUrl(`sales/${salesId}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.delete<null>(url, { headers });
      }));
    }));
  }

  getPersonalSummary(type: string): Observable<summary> {
    const url = this.profileUrl(`sales/personal-summary?q=${type}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<summary>(url, { headers });
      }));
    }));
  }

  getGroupSales(period: string, type?: string): Observable<groupSales[]> {
    const url = this.profileUrl(`sales/group/${period}/${type ? `?q=${type}` : ''}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<groupSales[]>(url, { headers });
      }));
    }));
  }

  getGroupSummary(type: string): Observable<any> {
    const url = this.profileUrl(`sales/group/summary?q=${type}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<any>(url, { headers });
      }));
    }));
  }

  getGroupDownlineSales(memberId: number, period: string, type?: string): Observable<downlineSales> {
    const url = this.profileUrl(`sales/group/${memberId}/year/?q=total`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<downlineSales>(url, { headers });
      }));
    }));
  }

}
