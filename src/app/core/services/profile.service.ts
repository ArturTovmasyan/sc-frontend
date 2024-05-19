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

  me(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/v1.0/profile/me`);
  }

  get(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/v1.0/profile/view`);
  }

  edit(data: any): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/profile/edit`, {
      'password': data.password,
      'email': data.email,
      'phones': data.phones,
      'first_name': data.first_name,
      'last_name': data.last_name,
      'avatar': data.avatar
    });
  }

  changePassword(data: any): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/profile/change-password`, {
      'password': data.password,
      'new_password': data.new_password,
      're_new_password': data.re_new_password,
    });
  }

  accept(): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/profile/license/accept`, {});
  }

  decline(): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/api/v1.0/profile/license/decline`, {});
  }
}
