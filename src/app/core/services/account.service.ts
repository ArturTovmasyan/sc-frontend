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
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/dashboard/account/signup`, {
      'first_name': data.firstName,
      'last_name': data.lastName,
      'email': data.email,
      'phone': data.phone,
      'password': data.password,
      're_password': data.rePassword
    });
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/dashboard/account/forgot-password`, {
      'email': data.email
    });
  }

  confirmPassword(data: any): Observable<any> {
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/dashboard/account/confirm-password`, {
      'email': data.email
    });
  }

}
