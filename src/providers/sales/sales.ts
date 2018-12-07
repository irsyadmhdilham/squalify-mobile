import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { ApiUrlModules } from "../../functions/config";
import { sales, summary, groupSales } from "../../interfaces/sales";

@Injectable()
export class SalesProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  createSales(userId, data: sales): Observable<sales> {
    const url = this.profileUrl(userId, 'sales/');
    return this.http.post<sales>(url, data);
  }

  getSales(userId, period: string, salesType: string): Observable<sales[]> {
    const url = this.profileUrl(userId, `sales/?p=${period}&t=${salesType}`);
    return this.http.get<sales[]>(url);
  }

  removeSales(userId, salesId): Observable<null> {
    const url = this.profileUrl(userId, `sales/${salesId}`);
    return this.http.delete<null>(url);
  }

  getPersonalSummary(userId, type: string): Observable<summary> {
    const url = this.profileUrl(userId, `sales/personal-summary?q=${type}`);
    return this.http.get<summary>(url);
  }

  getGroupSales(userId, period: string, type?: string): Observable<groupSales[]> {
    const url = this.profileUrl(userId, `sales/group/${period}/${type ? `?q=${type}` : ''}`);
    return this.http.get<groupSales[]>(url);
  }

  getGroupSummary(userId, type: string): Observable<any> {
    const url = this.profileUrl(userId, `sales/group/summary?q=${type}`);
    return this.http.get<any>(url);
  }

}
