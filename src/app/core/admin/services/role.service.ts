import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Role} from '../../models/role';
import {GridService} from '../../../shared/services/grid.service';

@Injectable({providedIn: 'root'})
export class RoleService extends GridService<Role> {
  constructor(http: HttpClient) {
    super(http);

    this.SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/role`;
  }
}

//
//
// import {Injectable} from '@angular/core';
// import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
// import {Observable} from 'rxjs';
// import {environment} from '../../../../environments/environment';
// import {AbstractGridService} from '../../services/abstract-grid.service';
// import {first} from 'rxjs/operators';
// import {saveFile} from '../../../shared/helpers/file-download-helper';
// import {Message} from '../../models/message';
// import {Role} from '../../models/role';
//
// @Injectable({providedIn: 'root'})
// export class RoleService extends AbstractGridService {
//   static SEVICE_URL_BASE = `${environment.apiUrl}/api/v1.0/admin/role`;
//
//   constructor(private http: HttpClient) {
//     super();
//   }
//
//   options(): Observable<any> {
//     return this.http.options(RoleService.SEVICE_URL_BASE + '/grid');
//   }
//
//   list(page: number,
//        per_page: number,
//        sort: { key: string, value: string }[],
//        filter: { [id: string]: { condition: number, value: any[] } }): Observable<Role[]> {
//
//     return this.http.get<Role[]>(
//       RoleService.SEVICE_URL_BASE + '/grid',
//       {
//         params: this.build_query(page, per_page, sort, filter)
//       });
//   }
//
//   pdf(callback: any) {
//     return this.http
//       .get(RoleService.SEVICE_URL_BASE + '/grid', {
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
//
//   removeBulk(ids: number[]) {
//     const options = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//       }),
//       body: {ids: ids},
//     };
//
//     return this.http.delete(RoleService.SEVICE_URL_BASE, options);
//   }
//
//   get(id: number): Observable<Role> {
//     return this.http.get<Role>(RoleService.SEVICE_URL_BASE + `/${id}`);
//   }
//
//   add(data: Role): Observable<any> {
//     return this.http.post<Message>(RoleService.SEVICE_URL_BASE, {
//       'name': data.name,
//       'default': data.default,
//       'space_id': data.space,
//       'space_default': data.space_default,
//       'permissions': data.permissions
//     });
//   }
//
//   edit(data: Role): Observable<any> {
//     return this.http.put<Message>(RoleService.SEVICE_URL_BASE + `/${data.id}`, {
//       'name': data.name,
//       'default': data.default,
//       'space_id': data.space,
//       'space_default': data.space_default,
//       'permissions': data.permissions
//     });
//   }
// }
