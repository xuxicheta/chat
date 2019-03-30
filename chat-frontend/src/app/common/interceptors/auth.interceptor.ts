import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private profileService: ProfileService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const interceptedRequest = request.clone({
      headers: request.headers.set('Authorization', this.profileService.getBearer())
    });
    return next.handle(interceptedRequest);
  }
}