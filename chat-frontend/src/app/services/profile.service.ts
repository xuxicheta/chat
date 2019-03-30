import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../common/classes/user.class';
import { HttpClient } from '@angular/common/http';
import { MessagingService } from './messaging.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profile$ = new BehaviorSubject<User>(User.empty());
  private loading: boolean;
  private logining: boolean;
  private userId: string;
  private bearer: string;

  constructor(
    private http: HttpClient,
    private messagingService: MessagingService,
  ) { }

  public getLogged() {
    return Boolean(this.userId);
  }

  public getProfile$() {
    return this.profile$.asObservable();
  }

  public getBearer() {
    return `Bearer ${this.bearer}`;
  }

  aquireLogin(username: string, password: string) {
    if (this.getLogged() || this.logining) {
      console.error('Attempt to multiple login');
      return;
    }

    this.logining = true;
    this.http.post('/api/auth/login', { username, password })
      .subscribe({
        next: (response: {bearer: string; userId: string}) => {
          this.bearer = response.bearer;
          this.userId = response.userId;
          this.aquireProfile();
          this.messagingService.connect(response.bearer);
        },
        error: error => {
          console.error(error);
        },
       complete: () => this.logining = false,
      });
  }

  aquireProfile() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.http.get(`/api/users/${this.userId}`)
      .subscribe({
        next: (response) => {
          this.profile$.next(new User(response));
        },
        error: error => {
          console.error(error);
        },
        complete: () => this.loading = false,
      });

  }


}
