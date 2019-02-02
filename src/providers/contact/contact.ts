import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { contact } from "../../models/contact";
import { ApiUrlModules } from "../../functions/config";

@Injectable()
export class ContactProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  addContact(data: contact): Observable<any> {
    const url = this.profileUrl('contact/');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.post<any>(url, data, { headers });
      }));
    }));
  }

  getContacts(fields: string): Observable<contact[]> {
    const url = this.profileUrl(`contact?fields=${fields}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<contact[]>(url, { headers });
      }));
    }));
  }
  getContactDetail(contactId: number): Observable<contact> {
    const url = this.profileUrl(`contact/${contactId}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<contact>(url, { headers });
      }));
    }));
  }

  updateContact(contactId: number, data: contact): Observable<contact> {
    let url = this.profileUrl(`contact/${contactId}/`);
    if (data.scheduleId && data.status === 'Appointment secured') {
      url = this.profileUrl(`contact/${contactId}/?xtra=add-schedule`);
    }
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.put<contact>(url, data, { headers });
      }))
    }));
  }

  removeContact(contactId: number): Observable<any> {
    const url = this.profileUrl(`contact/${contactId}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.delete<any>(url, { headers });
      }));
    }));
  }

}
