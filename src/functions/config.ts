import { isDevMode } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AES, enc } from "crypto-js";

export class ApiUrlModules {

  constructor(public storage: Storage) { }

  async agencyId() {
    const getId = await this.storage.get('agencyId');
    const bytes = AES.decrypt(getId, 'secret agency pk');
    return parseInt(bytes.toString(enc.Utf8));
  }

  async userId() {
    const data = await this.storage.get('userId')
    const bytes =  AES.decrypt(data, 'secret user pk');
    return parseInt(bytes.toString(enc.Utf8));
  }

  apiBaseUrl() {
    if (isDevMode()) {
      return 'http://localhost:8030/api/v1';
    }
    else {
      return 'https://squalify.com/api/v1';
    }
  }

  profileUrl(userId: number, url?: string) {
    if (!url) {
      return `${this.apiBaseUrl()}/profile/${userId}`;
    }
    return `${this.apiBaseUrl()}/profile/${userId}/${url}`;
  }

  agencyUrl(agencyId: number, url?: string) {
    if (!url) {
      return `${this.apiBaseUrl()}/agency/${agencyId}`;
    }
    return `${this.apiBaseUrl()}/agency/${agencyId}/${url}`;
  }

  profileUrlWithQuery(userId: number, url?: string) {
    if (!url) {
      return `${this.apiBaseUrl()}/profile/${userId}?`;
    }
    return `${this.apiBaseUrl()}/profile/${userId}/${url}?`;
  }

  otherUrl(url) {
    return `${this.apiBaseUrl()}/${url}`;
  }
}