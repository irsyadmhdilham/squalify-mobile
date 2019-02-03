import { HttpHeaders } from "@angular/common/http";
import { isDevMode } from '@angular/core';
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { AES, enc } from "crypto-js";

interface token {
  token: string;
}

export class Ids {

  constructor(public storage: Storage) { }

  userId(): Observable<number | boolean> {
    return Observable.fromPromise(this.userPromise());
  }

  agencyId(): Observable<number | boolean> {
    return Observable.fromPromise(this.agencyPromise());
  }

  fcmId(): Observable<number> {
    const fcmIdPromise = new Promise<number>(resolve => {
      this.storage.get('fcmId').then(fcmId => {
        console.log('storage fcm id =', fcmId);
        if (!fcmId) {
          resolve(null);
        } else {
          const bytes = AES.decrypt(fcmId, 'secret fcm id');
          console.log('storage fcm id after =', bytes.toString(enc.Utf8));
          resolve(parseInt(bytes.toString(enc.Utf8)));
        }
      });
    });
    return Observable.fromPromise(fcmIdPromise);
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

  removeAllCredentials(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const userId = this.storage.remove('userId'),
            agencyId = this.storage.remove('agencyId'),
            token = this.storage.remove('apiToken'),
            fcmId = this.storage.remove('fcmId');
      Promise.all([userId, agencyId, token, fcmId]).then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    });
  }

  httpOptions(): Observable<{headers: HttpHeaders}> {
    const token = this.storage.get('apiToken');
    return Observable.fromPromise<token>(token).pipe(switchMap(token => {
      const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
      const httpOptions = { headers };
      return Observable.of(httpOptions);
    }));
  }

  setCredentials(userId: number, agencyId: number, token: string, fcmId?: number) {
    const encryptedUserId = AES.encrypt(userId.toString(), 'secret user pk').toString(),
          encryptedAgencyId = AES.encrypt(agencyId.toString(), 'secret agency pk').toString();
    let encryptedFcmId: string;
    if (fcmId) {
      encryptedFcmId = AES.encrypt(fcmId.toString(), 'secret fcm id').toString();
    }
    const setUserId = this.storage.set('userId', encryptedUserId),
          setAgencyId = this.storage.set('agencyId', encryptedAgencyId),
          setToken = this.storage.set('apiToken', token);
    let setFcmId: Promise<any>;
    if (encryptedFcmId) {
      setFcmId = this.storage.set('fcmId', encryptedFcmId);
    }
    return new Promise(resolve => {
      const tasks = [setUserId, setAgencyId, setToken];
      if (setFcmId) {
        tasks.push(setFcmId);
      }
      Promise.all(tasks).then(() => {
        resolve(true);
      });
    });
  }

}

export class ApiUrlModules extends Ids {

  devIpAddress = 'http://192.168.1.7';

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