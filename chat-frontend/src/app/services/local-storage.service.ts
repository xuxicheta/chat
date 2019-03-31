import { Injectable } from '@angular/core';

export enum STORAGE_KEYS {
  BEARER = 'bearer',
  USER_ID = 'userId',
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private prefix = 'chat_675-';

  constructor() { }

  private key(prop: STORAGE_KEYS) {
    return `${this.prefix}${prop}`;
  }

  public get(prop: STORAGE_KEYS) {
    return localStorage.getItem(this.key(prop));
  }

  public set(prop: STORAGE_KEYS, data: any) {
    const lData = typeof data === 'string'
      ? data
      : JSON.stringify(data);
    localStorage.setItem(this.key(prop), lData);
  }

  public remove(prop: STORAGE_KEYS) {
    return localStorage.removeItem(this.key(prop));
  }
}
