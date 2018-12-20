import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ApiUrlModules } from "../../functions/config";

import { inbox, chat } from "../../interfaces/inbox";

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

  createInbox(data): Observable<inbox> {
    const url = this.profileUrl('inbox/');
    return url.pipe(switchMap(url => {
      return this.http.post<inbox>(url, data);
    }));
  }

  sendMessage(chatId: number, data): Observable<chat> {
    const url = this.profileUrl(`inbox/${chatId}/`);
    return url.pipe(switchMap(url => {
      return this.http.put<chat>(url, data);
    }));
  }

  getChat(chatId: number): Observable<chat> {
    const url = this.profileUrl(`inbox/${chatId}`);
    return url.pipe(switchMap(url => {
      return this.http.get<chat>(url);
    }));
  }

}
