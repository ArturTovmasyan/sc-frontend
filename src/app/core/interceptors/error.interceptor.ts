import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth$: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.error instanceof Blob && err.error.type === 'application/json') {
          // https://github.com/angular/angular/issues/19888
          // When request of type Blob, the error is also in Blob instead of object of the json data
          return new Promise<any>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: Event) => {
              try {
                const errmsg = JSON.parse((<any>e.target).result);
                const error = {'code': err.status, 'statusText': err.statusText, 'data': errmsg};
                reject(error);
              } catch (e) {
                reject(err);
              }
            };
            reader.onerror = (e) => {
              reject(err);
            };
            reader.readAsText(err.error);
          });
        } else {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.auth$.logout();
            // TODO(haykg) location.reload(true);
          }

          const error = {'code': err.status, 'statusText': err.statusText, 'data': err.error};
          return throwError(err);
        }
      })
    );
  }
}
