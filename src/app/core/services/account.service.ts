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
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/account/signup`, data);
  }

  accept(data: any): Observable<any> {
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/account/accept`, data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/account/forgot-password`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/account/reset-password`, data);
  }

  activate(data: any): Observable<any> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/account/activate`, data);
  }

}
