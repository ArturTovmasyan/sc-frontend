import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {User} from '../../models/user';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class UserService extends GridService<User> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/user`;
  }
}

// import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {Observable} from 'rxjs';
// import {environment} from '../../../../environments/environment';
// import {User} from '../../models/user';
// import {AbstractGridService} from '../../services/abstract-grid.service';
// import {HttpParams} from '../../../../../node_modules/@angular/common/http';
// import {first} from 'rxjs/operators';
// import {saveFile} from '../../../shared/helpers/file-download-helper';
// import {Space} from '../../models/space';
//
// @Injectable({providedIn: 'root'})
// export class UserService extends AbstractGridService {
//   static SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/user`;
//
//   constructor(private http: HttpClient) {
//     super();
//   }
//
//   all(): Observable<Space[]> {
//     return this.http.get<Space[]>(UserService.SEVICE_URL_BASE);
//   }
//
//   options(): Observable<any> {
//     return this.http.options(UserService.SEVICE_URL_BASE + '/grid');
//   }
//
//   list(page: number,
//        per_page: number,
//        sort: { key: string, value: string }[],
//        filter: { [id: string]: { condition: number, value: any[] } }): Observable<User[]> {
//
//     return this.http.get<User[]>(UserService.SEVICE_URL_BASE + '/grid', {params: this.build_query(page, per_page, sort, filter)});
//   }
//
//   pdf(callback: any) {
//     return this.http
//       .get(UserService.SEVICE_URL_BASE, {
//         responseType: 'blob',
//         observe: 'response',
//         params: new HttpParams().append('pdf', '1')
//       })
//       .pipe(first())
//       .subscribe(response => {
//         saveFile(response);
//         callback();
//       });
//   }
// }
