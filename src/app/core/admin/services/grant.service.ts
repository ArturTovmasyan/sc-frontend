import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {GrantNodeInterface} from '../components/role/form/form.component';

@Injectable({providedIn: 'root'})
export class GrantService {
  protected SEVICE_URL_BASE;

  constructor(protected http: HttpClient) {
    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/grant`;
  }

  all(): Observable<GrantNodeInterface[]> {
    return this.http.get<GrantNodeInterface[]>(this.SEVICE_URL_BASE + '/all');
  }

  role(ids: number[]) {
    return this.http.post(this.SEVICE_URL_BASE + '/role', {ids: ids});
  }

  get(url: string) {
    url = url.replace('/backend', '');
    return this.http.get(`${environment.apiUrl}${url}`);
  }
}
