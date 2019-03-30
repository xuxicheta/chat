import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../../dto/user.interface';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$ = new BehaviorSubject<User>({} as User);

  constructor(
    private http: HttpClient,
  ) { }

  login(username: string, password: string) {
    this.http.post('/api/login', {
      username,
      password,
    })
      .subscribe(response => {
        console.log(response);
      });
  }
}
