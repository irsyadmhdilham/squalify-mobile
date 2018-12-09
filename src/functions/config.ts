import { isDevMode } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AES, enc } from "crypto-js";

export class Ids {
  constructor(public storage: Storage) { }

  async agencyId() {
    const getId = await this.storage.get('agencyId');
    if (!getId) {
      return false;
    }
    const bytes = AES.decrypt(getId, 'secret agency pk');
    return parseInt(bytes.toString(enc.Utf8));
  }

  async userId() {
    const data = await this.storage.get('userId');
    if (!data) {
      return false;
    }
    const bytes =  AES.decrypt(data, 'secret user pk');
    return parseInt(bytes.toString(enc.Utf8));
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

  constructor(public storage: Storage) {
    super(storage);
  }

  apiBaseUrl() {
    if (isDevMode()) {
      return 'http://192.168.0.5:8030/v1';
    }
    return 'https://squalify.com/api/v1';
  }

  profileUrl(userId: number, url?: string) {
    if (!url) {
      return `${this.apiBaseUrl()}/profile/${userId}/`;
    }
    return `${this.apiBaseUrl()}/profile/${userId}/${url}`;
  }

  agencyUrl(agencyId: number, url?: string) {
    if (!url) {
      return `${this.apiBaseUrl()}/agency/${agencyId}`;
    }
    return `${this.apiBaseUrl()}/agency/${agencyId}/${url}`;
  }

  otherUrl(url) {
    return `${this.apiBaseUrl()}/${url}`;
  }
}