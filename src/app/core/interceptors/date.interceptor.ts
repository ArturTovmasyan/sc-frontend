import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {DateHelper} from '../../shared/helpers/date-helper';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (request.responseType === 'json') {
    //   this.convertTo(request.body);
    // }

    return next.handle(request)
      .pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.convertFrom(event.body);
        }
      }));
  }

  private convertFrom(object: Object) {
    if (!object || !(object instanceof Object)) {
      return;
    }

    if (object instanceof Array) {
      for (const item of object) {
        this.convertFrom(item);
      }
    }

    for (const key of Object.keys(object)) {
      const value = object[key];

      if (value instanceof Array) {
        for (const item of value) {
          this.convertFrom(item);
        }
      }

      if (value instanceof Object) {
        this.convertFrom(value);
      }

      if (typeof value === 'string' && DateHelper.REGEX_LOCAL.test(value)) {
        object[key] = new Date(value);
      }

      if (typeof value === 'string' && DateHelper.REGEX_UTC.test(value)) {
        object[key] = DateHelper.convertUTCString(value);
      }
    }
  }

  private convertTo(object: Object) {
    if (!object || !(object instanceof Object)) {
      return;
    }

    if (object instanceof Array) {
      for (const item of object) {
        this.convertTo(item);
      }
    }

    for (const key of Object.keys(object)) {
      const value = object[key];

      if (value instanceof Array) {
        for (const item of value) {
          this.convertTo(item);
        }
      }

      if (value instanceof Object) {
        this.convertTo(value);
      }

      if (value instanceof Date) {
        object[key] = value; // DateHelper.convertFromUTC(value);
      }
    }
  }
}
