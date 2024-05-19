import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TokenInfo} from '../models/token_info';

const CLIENT_ID: string = '1_3hmo4b44gomcss0sk8okk0gc88wo0kwocco0s0w4w0w48ww0c8';
const CLIENT_SECRET: string = '4tonqf6g79yc4ccsscokcogk08wscs40wookco8048wwk0k0kw';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private loggedIn: BehaviorSubject<boolean>;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('token')) != null);
  }

  sign_out() {
    // TODO: add sign_out api
    localStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/sign-in']);
  }

  sign_in(data: any): Observable<any> {
    return this.http.get<TokenInfo>(`${environment.apiUrl}/oauth/v2/token`, {
      params: {
        'username': data.username,
        'password': data.password,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'password'
      }
    })
      .pipe(map(token_info => {
        if (token_info && token_info.access_token) {
          localStorage.setItem('token', JSON.stringify(token_info));

          // request to user info
          this.loggedIn.next(true);
        }
      }));
  }

}
