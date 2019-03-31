import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private profileService: ProfileService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const interceptedRequest = request.clone({
      headers: request.headers.set('Authorization', this.profileService.getBearerHeader())
    });
    return next.handle(interceptedRequest).pipe(
      tap((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          // console.log(evt);
        }
      }, (error) =>  {
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.profileService.doLogout();
          }
        }
      })
    );
  }
}
