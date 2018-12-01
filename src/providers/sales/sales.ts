import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { ApiUrlModules } from "../../functions/config";
import { sales } from "../../interfaces/sales";

@Injectable()
export class SalesProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  createSales(userId, data: sales): Observable<sales> {
    const url = this.profileUrl(userId, 'sales/');
    return this.http.post<sales>(url, data);
  }

  getSales(userId): Observable<sales[]> {
    const url = this.profileUrl(userId, 'sales');
    return this.http.get<sales[]>(url);
  }

  removeSales(userId, salesId): Observable<any> {
    const url = this.profileUrl(userId, `sales/${salesId}`);
    return this.http.delete<any>(url);
  }

}
