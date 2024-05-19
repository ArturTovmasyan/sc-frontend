import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HomeService {

  protected SERVICE_URL_BASE;

  constructor(
    private http: HttpClient
  ) {
    this.SERVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/resident/admission/active/first`;
  }

  public list(): Observable<any> {
    return this.http.get(this.SERVICE_URL_BASE);
  }

}
