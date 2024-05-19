import * as moment from 'moment';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {DateHelper} from '../../shared/helpers/date-helper';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  private dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)$/;
  private utcDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.responseType === 'json') {
      this.convertTo(request.body);
    }

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

      if (typeof value === 'string' && this.dateRegex.test(value)) {
        object[key] = new Date(value);
      }

      if (typeof value === 'string' && this.utcDateRegex.test(value)) {
        object[key] = DateHelper.convertUTC(value);
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
        object[key] = DateHelper.convertFromUTC(value);
      }
    }
  }
}
