import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { contact } from "../../interfaces/contact";
import { ApiUrlModules } from "../../functions/config";

@Injectable()
export class ContactProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  addContact(userId: number, data: contact): Observable<any> {
    const url = this.profileUrl(userId, 'contact/');
    return this.http.post<any>(url, data);
  }

  getContacts(userId): Observable<contact[]> {
    const url = this.profileUrl(userId, 'contact');
    return this.http.get<contact[]>(url);
  }

  updateContact(userId, contactId, data): Observable<contact> {
    const url = this.profileUrl(userId, `contact/${contactId}`);
    return this.http.put<contact>(url, data);
  }

}
