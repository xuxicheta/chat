import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnLoggedGuard implements CanActivate {
  constructor(
    private profileService: ProfileService,
    private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree | boolean> {
    return this.profileService.lg$.pipe(
      take(1),
      map(logged => !logged || this.router.parseUrl('/chat')),
    );
  }
}
