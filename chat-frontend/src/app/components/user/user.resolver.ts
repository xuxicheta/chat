import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { switchMap, tap, map, flatMap, take } from 'rxjs/operators';


@Injectable()
export class UserResolver implements Resolve<any> {

  constructor(
    private profileService: ProfileService,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.profileService.user$.pipe(
      take(1),
      switchMap((user) => {
        const id = route.params.id || user.userId;
        return this.profileService.fetchUser(id);
      }),
    );
  }
}
