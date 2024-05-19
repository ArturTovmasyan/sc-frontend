import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AbstractGridService} from './abstract-grid.service';
import {first} from 'rxjs/operators';
import {saveFile} from '../../shared/helpers/file-download-helper';
import {Permission} from '../models/permission';

@Injectable({providedIn: 'root'})
export class PermissionService extends AbstractGridService {
  static SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/permission`;

  constructor(private http: HttpClient) {
    super();
  }

  all(): Observable<Permission[]> {
    return this.http.get<Permission[]>(PermissionService.SEVICE_URL_BASE);
  }

  options(): Observable<any> {
    return this.http.options(PermissionService.SEVICE_URL_BASE);
  }

  list(page: number,
       per_page: number,
       sort: { key: string, value: string }[],
       filter: { [id: string]: { condition: number, value: any[] } }): Observable<Permission[]> {

    return this.http.get<Permission[]>(PermissionService.SEVICE_URL_BASE + '/grid', {params: this.build_query(page, per_page, sort, filter)});
  }

  get(id: number): Observable<Permission> {
    return this.http.get<Permission>(PermissionService.SEVICE_URL_BASE + '/grid' + `/${id}`);
  }

  pdf(callback: any) {
    return this.http
      .get(PermissionService.SEVICE_URL_BASE, {
        responseType: 'blob',
        observe: 'response',
        params: new HttpParams().append('pdf', '1')
      })
      .pipe(first())
      .subscribe(response => {
        saveFile(response);
        callback();
      });
  }

  removeBulk(ids: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {ids: ids},
    };

    return this.http.delete(PermissionService.SEVICE_URL_BASE, options);
  }

  add(data: Permission): Observable<any> {
    return null;
  }

}
