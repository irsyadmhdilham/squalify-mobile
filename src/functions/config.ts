import { isDevMode } from '@angular/core';
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { AES, enc } from "crypto-js";

export class Ids {
  userId$: Observable<number> = Observable.fromPromise(this.userPromise()).pipe(take(1));
  agencyId$: Observable<number> = Observable.fromPromise(this.agencyPromise()).pipe(take(1));

  constructor(public storage: Storage) { }

  userPromise(): Promise<number> {
    return new Promise<number>(resolve => {
      this.storage.get('userId').then(value => {
        const bytes =  AES.decrypt(value, 'secret user pk');
        resolve(parseInt(bytes.toString(enc.Utf8)));
      });
    });
  }

  agencyPromise(): Promise<number> {
    return new Promise<number>(resolve => {
      this.storage.get('agencyId').then(value => {
        const bytes =  AES.decrypt(value, 'secret agency pk');
        resolve(parseInt(bytes.toString(enc.Utf8)));
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

  devIpAddress = 'http://192.168.0.5';
  userId: number;
  agencyId: number;

  constructor(public storage: Storage) {
    super(storage);
    this.userId$.subscribe(userId => (this.userId = userId));
    this.agencyId$.subscribe(agencyId => (this.agencyId = agencyId));
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
    let id = this.userId;
    if (userId) {
      id = userId;
    }
    if (!url) {
      return `${this.apiBaseUrl()}/profile/${id}/`;
    }
    return `${this.apiBaseUrl()}/profile/${id}/${url}`;
  }

  agencyUrl(url?: string) {
    let agencyId = this.agencyId;
    if (!url) {
      return `${this.apiBaseUrl()}/agency/${agencyId}`;
    }
    return `${this.apiBaseUrl()}/agency/${agencyId}/${url}`;
  }

  otherUrl(url) {
    return `${this.apiBaseUrl()}/${url}`;
  }
}