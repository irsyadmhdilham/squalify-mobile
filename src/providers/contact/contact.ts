import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { apiBaseUrl } from "../../functions/config";

import { contact } from "../../interfaces/contact";

@Injectable()
export class ContactProvider {

  userId = '15';

  constructor(public http: HttpClient) { }

  addContact(data: contact): Observable<any> {
    const url = `${apiBaseUrl()}/profile/${this.userId}/contact`;
    return this.http.post<any>(url, data);
  }

}
