import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { switchMap, map, take } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";
import { sales, summary, groupSales, salesIo } from "../../models/sales";
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

interface summaryOutput {
  cases: number;
  total: string;
}

interface salesStatus {
  in_hand: summaryOutput;
  submitted: summaryOutput;
  rejected: summaryOutput;
  disburst: summaryOutput;
};

interface summaryResponse {
  year: salesStatus;
  month: salesStatus;
  week: salesStatus;
  today: salesStatus;
};

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

  getSales(period: string, salesType: string, salesStatus: string): Observable<sales[]> {
    const url = this.profileUrl(`sales/?p=${period}&st=${salesType}&s=${salesStatus}`);
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

  getPersonalSummary(salesType: string): Observable<summary> {
    const url = this.profileUrl(`sales/summary/?st=${salesType}`);
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

  groupSalesFilter(period: string, type: string, status: string): Observable<groupSales[]> {
    const url = this.profileUrl(`sales/group/filter/?p=${period}&st=${type}&s=${status}`);
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
    const year = value.year,
          month = value.month,
          week = value.week,
          today = value.today;
    return {
      year: {
        in_hand: {
          ...year.in_hand,
          total: parseFloat(year.in_hand.total)
        },
        rejected: {
          ...year.rejected,
          total: parseFloat(year.rejected.total)
        },
        disburst: {
          ...year.disburst,
          total: parseFloat(year.disburst.total)
        },
        submitted: {
          ...year.submitted,
          total: parseFloat(year.submitted.total)
        }
      },
      month: {
        in_hand: {
          ...month.in_hand,
          total: parseFloat(month.in_hand.total)
        },
        rejected: {
          ...month.rejected,
          total: parseFloat(month.rejected.total)
        },
        disburst: {
          ...month.disburst,
          total: parseFloat(month.disburst.total)
        },
        submitted: {
          ...month.submitted,
          total: parseFloat(month.submitted.total)
        }
      },
      week: {
        in_hand: {
          ...week.in_hand,
          total: parseFloat(week.in_hand.total)
        },
        rejected: {
          ...week.rejected,
          total: parseFloat(week.rejected.total)
        },
        disburst: {
          ...week.disburst,
          total: parseFloat(week.disburst.total)
        },
        submitted: {
          ...week.submitted,
          total: parseFloat(week.submitted.total)
        }
      },
      today: {
        in_hand: {
          ...today.in_hand,
          total: parseFloat(today.in_hand.total)
        },
        rejected: {
          ...today.rejected,
          total: parseFloat(today.rejected.total)
        },
        disburst: {
          ...today.disburst,
          total: parseFloat(today.disburst.total)
        },
        submitted: {
          ...today.submitted,
          total: parseFloat(today.submitted.total)
        }
      }
    };
  }

  getGroupSummary(type: string): Observable<summary> {
    const url = this.profileUrl(`sales/group/summary/?st=${type}`);
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

  downlinesSummary(memberId: number, type: string): Observable<summary> {
    const url = this.profileUrl(`sales/group/downlines/${memberId}/summary/?st=${type}`);
    return url.pipe(switchMap(url => {
      return this.httpOptions().pipe(switchMap(httpOptions => {
        return this.http.get<summaryResponse>(url, httpOptions).pipe(map(response => this.summarySerializer(response)));
      }));
    }));
  }

}
