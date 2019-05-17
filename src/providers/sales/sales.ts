import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { switchMap, map, take } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { sales, groupSales, salesIo } from "../../models/sales";
import { store } from "../../models/store";

interface salesResponse {
  pk?: number;
  timestamp?: string;
  amount: string;
  sales_type: string;
  sales_status?: string;
  location?: string;
  commission?: string;
  contact?: {
    pk: number;
    name: string;
  }
  client_name?: string;
};

interface groupResponse {
  pk: number;
  name: string;
  profile_image: string;
  designation: string;
  personal: string;
  group: string;
  downline?: number;
}

interface summary {
  in_hand: { cases: number; total: number; };
  submitted: { cases: number; total: number; };
  rejected: { cases: number; total: number; };
  disburst: { cases: number; total: number; };
};

interface summaryResponse {
  in_hand: { cases: number; total: string; };
  submitted: { cases: number; total: string; };
  rejected: { cases: number; total: string; };
  disburst: { cases: number; total: string; };
}

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

  createSales(data: sales, timestamp=false): Observable<sales> {
    let str = 'sales/';
    if (timestamp) {
      str = 'sales/?ts=true'
    }
    const url = this.profileUrl(str);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.post<sales>(url, data, httpOptions);
      }));
    }));
  }

  updateSales(salesId: number, data: any): Observable<sales> {
    const url = this.profileUrl(`sales/${salesId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.put<salesResponse>(url, data, httpOptions).pipe(map(response => {
          return {
            ...response,
            timestamp: new Date(response.timestamp),
            amount: parseFloat(response.amount),
            commission: response.commission ? parseFloat(response.commission) : null
          }
        }));
      }));
    }));
  }

  getSales(period: string, salesType: string, salesStatus: string, dateSelect?: {from: Date; until: Date}): Observable<sales[]> {
    const dateSelectFunc = () => {
      if (dateSelect) {
        return `&f=${dateSelect.from.toISOString()}&u=${dateSelect.until.toISOString()}`;
      }
      return '';
    };
    const url = this.profileUrl(`sales/?p=${period}&st=${salesType}&s=${salesStatus}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<salesResponse[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            timestamp: new Date(value.timestamp),
            amount: parseFloat(value.amount),
            commission: value.commission ? parseFloat(value.commission) : null
          }));
        }));
      }));
    }));
  }

  removeSales(salesId): Observable<null> {
    const url = this.profileUrl(`sales/${salesId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.delete<null>(url, httpOptions);
      }));
    }));
  }

  getPersonalSummary(salesType: string, period: string, dateSelect: { from: Date; until: Date; }): Observable<summary> {
    function dateSelectFunc() {
      if (dateSelect) {
        return `&f=${dateSelect.from.toISOString()}&u=${dateSelect.until.toISOString()}`;
      }
      return '';
    }
    const url = this.profileUrl(`sales/summary/?st=${salesType}&p=${period}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<summaryResponse>(url, httpOptions).pipe(map(response => {
          return this.summarySerializer(response);
        }));
      }));
    }));
  }

  getGroupSales(): Observable<groupSales[]> {
    const url = this.profileUrl('sales/group/');
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<groupResponse[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            personal: parseFloat(value.personal),
            group: parseFloat(value.group)
          }));
        }));
      }));
    }));
  }

  groupSalesFilter(period: string, type: string, status: string, dateSelect?: {from: Date; until: Date}): Observable<groupSales[]> {
    const dateSelectFunc = () => {
      if (dateSelect) {
        return `&f=${dateSelect.from.toISOString()}&u=${dateSelect.until.toISOString()}`;
      }
      return '';
    };
    const url = this.profileUrl(`sales/group/filter/?p=${period}&st=${type}&s=${status}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<groupResponse[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            personal: parseFloat(value.personal),
            group: parseFloat(value.group)
          }));
        }));
      }));
    }));
  }

  summarySerializer(value: summaryResponse): summary {
    return {
      in_hand: {
        ...value.in_hand,
        total: parseFloat(value.in_hand.total)
      },
      rejected: {
        ...value.rejected,
        total: parseFloat(value.rejected.total)
      },
      disburst: {
        ...value.disburst,
        total: parseFloat(value.disburst.total)
      },
      submitted: {
        ...value.submitted,
        total: parseFloat(value.submitted.total)
      }
    };
  }

  getGroupSummary(type: string, period: string, dateSelect: { from: Date; until: Date; }): Observable<summary> {
    function dateSelectFunc() {
      if (dateSelect) {
        return `&f=${dateSelect.from.toISOString()}&u=${dateSelect.until.toISOString()}`;
      }
      return '';
    }
    const url = this.profileUrl(`sales/group/summary/?st=${type}&p=${period}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<summaryResponse>(url, httpOptions).pipe(map(response => this.summarySerializer(response)));
      }));
    }));
  }

  getGroupDownlineSales(memberId: number): Observable<groupSales[]> {
    const url = this.profileUrl(`sales/group/downlines/${memberId}/`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<groupResponse[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            personal: parseFloat(value.personal),
            group: parseFloat(value.group)
          }));
        }));
      }));
    }));
  }

  downlinesSalesFilter(memberId: number, period: string, type: string, status: string): Observable<groupSales[]> {
    const url = this.profileUrl(`sales/group/downlines/${memberId}/filter/?p=${period}&st=${type}&s=${status}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<groupResponse[]>(url, httpOptions).pipe(map(response => {
          return response.map(value => ({
            ...value,
            personal: parseFloat(value.personal),
            group: parseFloat(value.group)
          }));
        }));
      }));
    }));
  }

  downlinesSummary(memberId: number, type: string, period: string, dateSelect: { from: Date; until: Date; }): Observable<summary> {
    function dateSelectFunc() {
      if (dateSelect) {
        return `&f=${dateSelect.from.toISOString()}&u=${dateSelect.until.toISOString()}`;
      }
      return '';
    }
    const url = this.profileUrl(`sales/group/downlines/${memberId}/summary/?st=${type}&p=${period}${dateSelectFunc()}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<summaryResponse>(url, httpOptions).pipe(map(response => this.summarySerializer(response)));
      }));
    }));
  }

}
