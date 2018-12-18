import { isDevMode } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AES, enc } from "crypto-js";

export class Ids {
  userId: number | boolean;
  agencyId: number | boolean;

  constructor(public storage: Storage) {
    this.storage.get('userId').then(value => {
      if (!value) {
        this.userId = false;
      } else {
        const bytes =  AES.decrypt(value, 'secret user pk');
        this.userId = parseInt(bytes.toString(enc.Utf8));
      }
    });

    this.storage.get('agencyId').then(value => {
      if (!value) {
        this.agencyId = false;
      } else {
        const bytes =  AES.decrypt(value, 'secret agency pk');
        this.agencyId = parseInt(bytes.toString(enc.Utf8));
      }
    });
  }

  // async agencyId() {
  //   const getId = await this.storage.get('agencyId');
  //   if (!getId) {
  //     return false;
  //   }
  //   const bytes = AES.decrypt(getId, 'secret agency pk');
  //   return parseInt(bytes.toString(enc.Utf8));
  // }

  // async userId() {
  //   const data = await this.storage.get('userId');
  //   if (!data) {
  //     return false;
  //   }
  //   const bytes =  AES.decrypt(data, 'secret user pk');
  //   return parseInt(bytes.toString(enc.Utf8));
  // }

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
    if (!url) {
      return `${this.apiBaseUrl()}/agency/${this.agencyId}`;
    }
    return `${this.apiBaseUrl()}/agency/${this.agencyId}/${url}`;
  }

  otherUrl(url) {
    return `${this.apiBaseUrl()}/${url}`;
  }
}