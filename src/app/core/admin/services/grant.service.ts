import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
    return this.http.get<GrantNodeInterface[]>(this.SEVICE_URL_BASE);
  }
}
