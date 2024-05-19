import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {environment} from '../../../environments/environment.prod';
import {SnotifyService} from 'ng-snotify';

@Injectable()
export class AuthService implements OnInit {
    private baseOrigin = environment.host;
    private baseUrl    = this.baseOrigin;

    constructor(private http: HttpClient, private router: Router, private snotifyService: SnotifyService) {
    }

    ngOnInit() {
    }

    getPath() {
        return this.baseOrigin;
    }

    getHeader(): HttpHeaders {
        return new HttpHeaders({'Content-Type': 'application/json'});
    }

    getHeaderAuth(): HttpHeaders {
        return new HttpHeaders({'Authorization': 'Bearer ' + this.getToken(), 'Content-Type': 'application/json'});
    }

    /**
     * @returns {string}
     */
    getToken(): string {
        if (localStorage.getItem('at')) {
            return localStorage.getItem('at');
        }

        return null;
    }

    /**
     * @param error
     */
    private handleError(error: any) {
        const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        if (error.status && error.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
        }

        if (!error.status || (error.status && error.status !== 401 && error.status !== 200)) {
            this.snotifyService.error(error.error.message ? 'ERROR: ' + error.error.message : 'Unknown error occured!');
        }

        return throwError(error);
    }

    /**
     * @returns {string}
     */
    checkCustomerVerification(): any {
        if (localStorage.getItem('unverified')) {
            this.router.navigate(['/change-password']);
        }
    }

    /**
     * @param loginData
     * @returns {any}
     */
    auth(loginData: Object): Observable<any> {
        return this.http.post(this.baseUrl + '/security/login', JSON.stringify(loginData), {headers: this.getHeader()})
            .map((res: Response) => res)
            .catch(this.handleError.bind(this));
    }

    /**
     * @param signupData
     * @returns {any}
     */
    signup(signupData: Object): Observable<any> {
        return this.http.post(this.baseUrl + '/security/signup', JSON.stringify(signupData), {headers: this.getHeader()})
            .map((res: Response) => res)
            .catch(this.handleError.bind(this));
    }

    /**
     * @param hash
     * @returns {Observable<any>}
     */
    getUserByHash(hash: string): Observable<any> {
        return this.http.get(this.baseUrl + '/api/v1.0/user/hash/' + hash, {headers: this.getHeaderAuth()})
            .map((res: Response) => res)
            .catch(this.handleError.bind(this));
    }

    /**
     * @param forgotPasswordData
     * @returns {any}
     */
    forgotPassword(forgotPasswordData: Object): Observable<any> {
        return this.http.post(this.baseUrl + '/security/forgot-password', JSON.stringify(forgotPasswordData), {headers: this.getHeader()})
            .map((res: Response) => res)
            .catch(this.handleError.bind(this));
    }

    /**
     * @param data
     * @returns {Observable<any>}
     */
    confirmPassword(data: Object): Observable<any> {
        return this.http.put(this.baseUrl + '/api/v1.0/security/confirm-password', JSON.stringify(data), {headers: this.getHeaderAuth()})
            .map((res: Response) => res)
            .catch(this.handleError.bind(this));
    }

    /**
     * Logout user
     */
    logout(): void {
        localStorage.clear();
        this.router.navigate(['/']);
    }

    /**
     * @param userData
     * @returns {Observable<any>}
     */
    changePassword(userData: any): Observable<any> {
        return this.http.put(this.baseUrl + '/api/v1.0/security/change-password', userData, {headers: this.getHeaderAuth()})
            .map((res: Response) => res)
            .catch(this.handleError.bind(this));
    }

    /**
     * @param data
     * @returns {Observable<any>}
     */
    resetPassword(data: any): Observable<any> {
        return this.http.put(this.baseUrl + '/api/v1.0/security/reset-password', data, {headers: this.getHeaderAuth()})
            .map((res: Response) => res)
            .catch(this.handleError.bind(this));
    }
}
