import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Message} from '../models/message';


@Injectable({providedIn: 'root'})
export class AccountService {
  constructor(private http: HttpClient) {
  }

  signup(data: any): Observable<any> {
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/dashboard/account/signup`, data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/dashboard/account/forgot-password`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/dashboard/account/reset-password`, data);
  }

  activate(data: any): Observable<any> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/dashboard/account/activate`, data);
  }

}
