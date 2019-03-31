import { Injectable } from '@angular/core';
import { ReplaySubject, of } from 'rxjs';
import { User } from '../common/classes/user.class';
import { HttpClient } from '@angular/common/http';
import { MessagingService } from './messaging.service';
import { LocalStorageService, STORAGE_KEYS } from './local-storage.service';
import { tap, filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private user$$ = new ReplaySubject<User>(1);
  private lg$$ = new ReplaySubject<boolean>(1);
  private userId: string;
  private bearer: string;

  private loginLock: boolean;
  private logoutLock: boolean;

  get lg$() {
    return this.lg$$.asObservable();
  }

  get user$() {
    return this.user$$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private messagingService: MessagingService,
    private localStorageService: LocalStorageService,
  ) { }

  public getBearerHeader() {
    return `Bearer ${this.bearer}`;
  }

  acquireLogin(username: string, password: string) {
    of('').pipe(
      filter(() => !this.loginLock),
      tap(() => this.loginLock = true),
      switchMap(() => this.http.post('/api/auth/login', { username, password })),
      tap((response: { bearer: string; userId: string }) => {
        this.bearer = response.bearer;
        this.userId = response.userId;
      }),
      switchMap(() => this.fetchUser(this.userId))
    )
      .subscribe({
        next: response => this.doLogin(response),
        error: error => this.loginLock = false,
      });
  }

  private doLogin(userResponse) {
    console.log('doLogin');
    this.user$$.next(new User(userResponse));
    this.lg$$.next(true);
    this.messagingService.connect(this.bearer);
    this.localSave();
    this.logoutLock = false;
  }

  doLogout() {
    console.log('doLogout');
    this.user$$.next(User.empty());
    this.lg$$.next(false);
    this.localRemove();
    this.bearer = null;
    this.userId = null;
    this.messagingService.disconnect();
    this.loginLock = false;
  }

  acquireLogout() {
    console.log('acquireLogout');
    of('').pipe(
      filter(() => !this.logoutLock),
      tap(() => this.logoutLock = true),
      switchMap(() => this.http.post('/api/auth/logout', {}, { responseType: 'text' })),
    )
      .subscribe({
        next: () => this.doLogout(),
        error: error => this.logoutLock = false,
      });
  }

  checkLogin(bearer: string, userId: string) {
    this.bearer = bearer;
    this.userId = userId;
    this.fetchUser(this.userId)
      .subscribe({
        next: response => this.doLogin(response),
        error: error => console.error(error),
      });
  }

  private localSave() {
    this.localStorageService.set(STORAGE_KEYS.BEARER, this.bearer);
    this.localStorageService.set(STORAGE_KEYS.USER_ID, this.userId);
  }

  private localRemove() {
    this.localStorageService.remove(STORAGE_KEYS.BEARER);
    this.localStorageService.remove(STORAGE_KEYS.USER_ID);
  }

  public fetchUser(userId: string) {
    return this.http.get(`/api/users/${userId}`);
  }

  public updateUser(userId: string, data: any) {
    return this.http.patch(`/api/users/${userId}`, data, { responseType: 'text' });
  }

  public createUser(data: any) {
    return this.http.post('/api/users', data, { responseType: 'text' });
  }
}
