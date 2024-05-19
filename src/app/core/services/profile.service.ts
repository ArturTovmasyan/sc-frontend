import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Message} from '../models/message';
import {User} from '../models/user';


@Injectable({providedIn: 'root'})
export class ProfileService {
  constructor(private http: HttpClient) {
  }

  get(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/v1.0/profile/me`);
  }

  edit(data: any): Observable<Message> {
    return this.http.post<Message>(`${environment.apiUrl}/api/v1.0/profile/edit`, {
      'password': data.password,
      'email': data.email,
      'phone': data.phone,
      'first_name': data.firstName,
      'last_name': data.lastName
    });
  }

  changePassword(data: any): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/profile/change-password`, {
      'password': data.password,
      'new_password': data.newPassword,
      're_new_password': data.reNewPassword,
    });
  }

}
