import { isDevMode } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { AES, enc } from "crypto-js";

export class Ids {

  constructor(public storage: Storage) { }

  userId(): Observable<number | boolean> {
    return Observable.fromPromise(this.userPromise());
  }

  agencyId(): Observable<number | boolean> {
    return Observable.fromPromise(this.agencyPromise());
  }

  userPromise(): Promise<number | boolean> {
    return new Promise<number | boolean>(resolve => {
      this.storage.get('userId').then(value => {
        if (!value) {
          resolve(false);
        } else {
          const bytes =  AES.decrypt(value, 'secret user pk');
          resolve(parseInt(bytes.toString(enc.Utf8)));
        }
      });
    });
  }

  agencyPromise(): Promise<number | boolean> {
    return new Promise<number | boolean>(resolve => {
      this.storage.get('agencyId').then(value => {
        if (!value) {
          resolve(false);
        } else {
          const bytes =  AES.decrypt(value, 'secret agency pk');
          resolve(parseInt(bytes.toString(enc.Utf8)));
        }
      });
    })
  }

  removeAllId(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const userId = this.storage.remove('userId'),
            agencyId = this.storage.remove('agencyId');
      Promise.all([userId, agencyId]).then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    });
  }

  setIds(userId: number, agencyId: number) {
    const encryptedUserId = AES.encrypt(userId.toString(), 'secret user pk').toString(),
          encryptedAgencyId = AES.encrypt(agencyId.toString(), 'secret agency pk').toString();
    const setUserId = this.storage.set('userId', encryptedUserId),
          setAgencyId = this.storage.set('agencyId', encryptedAgencyId);
    return new Promise(resolve => {
      Promise.all([setUserId, setAgencyId]).then(() => {
        resolve(true);
      });
    });
  }

}

export class ApiUrlModules extends Ids {

  devIpAddress = 'http://192.168.0.4';

  constructor(public storage: Storage) {
    super(storage);
  }

  wsBaseUrl(namespace: string) {
    if (isDevMode()) {
      return `${this.devIpAddress}:8040/${namespace}`;
    }
    return `https://ws.squalify.com/${namespace}`;
  }

  apiBaseUrl() {
    if (isDevMode()) {
      return `${this.devIpAddress}:8030/v1`;
    }
    return 'https://api.squalify.com/v1';
  }

  profileUrl(url?: string, userId?: number) {
    return this.userId().pipe(map(value => {
      let id = value;
      if (userId) {
        id = userId;
      }
      if (!url) {
        return `${this.apiBaseUrl()}/profile/${id}/`;
      }
      return `${this.apiBaseUrl()}/profile/${id}/${url}`;
    }));
  }

  agencyUrl(url?: string): Observable<string> {
    return this.agencyId().pipe(map(agencyId => {
      if (!url) {
        return `${this.apiBaseUrl()}/agency/${agencyId}/`;
      }
      return `${this.apiBaseUrl()}/agency/${agencyId}/${url}`;
    }));
  }

  otherUrl(url) {
    return `${this.apiBaseUrl()}/${url}`;
  }
}