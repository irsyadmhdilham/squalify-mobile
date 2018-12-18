import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { ApiUrlModules } from "../../functions/config";
import { sales, summary, groupSales, downlineSales } from "../../interfaces/sales";

@Injectable()
export class SalesProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  createSales(data: sales): Observable<sales> {
    const url = this.profileUrl('sales/');
    return this.http.post<sales>(url, data);
  }

  getSales(period: string, salesType: string): Observable<sales[]> {
    const url = this.profileUrl(`sales/?p=${period}&t=${salesType}`);
    return this.http.get<sales[]>(url);
  }

  removeSales(salesId): Observable<null> {
    const url = this.profileUrl(`sales/${salesId}`);
    return this.http.delete<null>(url);
  }

  getPersonalSummary(type: string): Observable<summary> {
    const url = this.profileUrl(`sales/personal-summary?q=${type}`);
    return this.http.get<summary>(url);
  }

  getGroupSales(period: string, type?: string): Observable<groupSales[]> {
    const url = this.profileUrl(`sales/group/${period}/${type ? `?q=${type}` : ''}`);
    return this.http.get<groupSales[]>(url);
  }

  getGroupSummary(type: string): Observable<any> {
    const url = this.profileUrl(`sales/group/summary?q=${type}`);
    return this.http.get<any>(url);
  }

  getGroupDownlineSales(memberId: number, period: string, type?: string): Observable<downlineSales> {
    const url = this.profileUrl(`sales/group/${memberId}/year/?q=total`);
    return this.http.get<downlineSales>(url);
  }

}
