import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = JSON.parse(localStorage.getItem('token'));
    if (token && token.access_token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.access_token}`
        }
      });
    }

    return next.handle(request);
  }
}
