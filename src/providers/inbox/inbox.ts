import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";

import { inbox, message } from "../../interfaces/inbox";

type createInbox = { message: message, inbox: inbox; };

@Injectable()
export class InboxProvider extends ApiUrlModules {

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getInbox(): Observable<inbox[]> {
    const url = this.profileUrl('inbox');
    return url.pipe(switchMap(url => {
      return this.http.get<inbox[]>(url);
    }));
  }

  getInboxDetail(inboxId: number): Observable<inbox> {
    const url = this.profileUrl(`inbox/${inboxId}`);
    return url.pipe(switchMap(url => {
      return this.http.get<inbox>(url);
    }));
  }

  createInbox(data): Observable<createInbox> {
    const url = this.profileUrl('inbox/');
    return url.pipe(switchMap(url => {
      return this.http.post<createInbox>(url, data);
    }));
  }

  sendMessage(inboxId: number, data): Observable<message> {
    const url = this.profileUrl(`inbox/${inboxId}/`);
    return url.pipe(switchMap(url => {
      return this.http.put<message>(url, data);
    }));
  }

  clearUnread(inboxId: number): Observable<{status: boolean}> {
    const url = this.profileUrl(`inbox/${inboxId}/?cu=true`);
    return url.pipe(switchMap(url => {
      return this.http.put<{status: boolean}>(url, null);
    }))
  }

}
