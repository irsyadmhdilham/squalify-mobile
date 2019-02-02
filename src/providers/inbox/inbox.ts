import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";

import { inbox, message } from "../../models/inbox";
import { notification } from "../../models/notification";

interface createInbox {
  message: message;
  inbox: inbox;
  receiver_create?: inbox;
  receiver_update?: { pk: number; message: message; };
  notif: notification
};

interface sendMessage {
  message: message;
  receiver_create?: inbox;
  receiver_update?: { pk: number; message: message };
  notif: notification
};

export interface newMessage {
  pk: number;
  message: message;
};

export interface newGroupMessage {
  message: message;
  sender: number;
  groupChatId: number;
  inboxId: number;
}

@Injectable()
export class InboxProvider extends ApiUrlModules {

  newMessage$ = new Subject<newMessage>();
  newInbox$ = new Subject<inbox>();
  newGroupMessage$ = new Subject<newGroupMessage>();

  constructor(public http: HttpClient, public storage: Storage) {
    super(storage);
  }

  getInbox(): Observable<inbox[]> {
    const url = this.profileUrl('inbox');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<inbox[]>(url, { headers });
      }));
    }));
  }

  getInboxDetail(inboxId: number): Observable<inbox> {
    const url = this.profileUrl(`inbox/${inboxId}`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<inbox>(url, { headers });
      }));
    }));
  }

  getGroupInboxDetail(inboxId: number): Observable<inbox> {
    const url = this.profileUrl(`inbox/${inboxId}/group`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.get<inbox>(url, { headers });
      }));
    }));
  }

  createInbox(data): Observable<createInbox> {
    const url = this.profileUrl('inbox/');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.post<createInbox>(url, data, { headers });
      }));
    }));
  }

  createGroup(data): Observable<inbox> {
    const url = this.profileUrl('inbox/create-group/');
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.post<inbox>(url, data, { headers });
      }));
    }));
  }

  sendMessage(inboxId: number, data): Observable<sendMessage> {
    const url = this.profileUrl(`inbox/${inboxId}/`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.put<sendMessage>(url, data, { headers });
      }));
    }));
  }

  sendGroupMessage(inboxId: number, data): Observable<message> {
    const url = this.profileUrl(`inbox/${inboxId}/group/`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.put<message>(url, data, { headers });
      }));
    }));
  }

  clearUnread(inboxId: number): Observable<{status: boolean}> {
    const url = this.profileUrl(`inbox/${inboxId}/?cu=true`);
    return url.pipe(switchMap(url => {
      return this.authHeaders().pipe(switchMap(headers => {
        return this.http.put<{status: boolean}>(url, null, { headers });
      }));
    }))
  }

}
